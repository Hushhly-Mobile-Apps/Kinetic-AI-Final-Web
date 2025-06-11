import time
import psutil
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import logging
from dataclasses import dataclass
from collections import defaultdict, deque
import threading
from contextlib import contextmanager

try:
    import GPUtil
    GPU_AVAILABLE = True
except ImportError:
    GPU_AVAILABLE = False

from config import settings
from cache import cache

logger = logging.getLogger(__name__)

@dataclass
class MetricPoint:
    """Single metric data point"""
    timestamp: datetime
    value: float
    labels: Dict[str, str] = None

class MetricsCollector:
    """Collect and store application metrics"""
    
    def __init__(self, max_points: int = 1000):
        self.max_points = max_points
        self.metrics = defaultdict(lambda: deque(maxlen=max_points))
        self.counters = defaultdict(int)
        self.gauges = defaultdict(float)
        self.histograms = defaultdict(list)
        self._lock = threading.Lock()
    
    def counter(self, name: str, value: float = 1, labels: Dict[str, str] = None):
        """Increment counter metric"""
        with self._lock:
            key = self._make_key(name, labels)
            self.counters[key] += value
            self._add_point(name, self.counters[key], labels)
    
    def gauge(self, name: str, value: float, labels: Dict[str, str] = None):
        """Set gauge metric"""
        with self._lock:
            key = self._make_key(name, labels)
            self.gauges[key] = value
            self._add_point(name, value, labels)
    
    def histogram(self, name: str, value: float, labels: Dict[str, str] = None):
        """Add value to histogram"""
        with self._lock:
            key = self._make_key(name, labels)
            self.histograms[key].append(value)
            # Keep only recent values
            if len(self.histograms[key]) > self.max_points:
                self.histograms[key] = self.histograms[key][-self.max_points:]
            self._add_point(name, value, labels)
    
    def _make_key(self, name: str, labels: Dict[str, str] = None) -> str:
        """Create metric key with labels"""
        if not labels:
            return name
        
        label_str = ','.join(f'{k}={v}' for k, v in sorted(labels.items()))
        return f"{name}{{{label_str}}}"
    
    def _add_point(self, name: str, value: float, labels: Dict[str, str] = None):
        """Add metric point to time series"""
        point = MetricPoint(
            timestamp=datetime.utcnow(),
            value=value,
            labels=labels or {}
        )
        self.metrics[name].append(point)
    
    def get_metrics(self, name: str = None) -> Dict[str, Any]:
        """Get metrics data"""
        with self._lock:
            if name:
                return {
                    'points': list(self.metrics.get(name, [])),
                    'current_value': self.gauges.get(name, 0)
                }
            
            return {
                'counters': dict(self.counters),
                'gauges': dict(self.gauges),
                'histograms': {k: {
                    'values': v,
                    'count': len(v),
                    'avg': sum(v) / len(v) if v else 0,
                    'min': min(v) if v else 0,
                    'max': max(v) if v else 0
                } for k, v in self.histograms.items()},
                'time_series': {k: list(v) for k, v in self.metrics.items()}
            }
    
    def clear_metrics(self, older_than: timedelta = None):
        """Clear old metrics"""
        if not older_than:
            older_than = timedelta(hours=24)
        
        cutoff_time = datetime.utcnow() - older_than
        
        with self._lock:
            for name, points in self.metrics.items():
                # Remove old points
                while points and points[0].timestamp < cutoff_time:
                    points.popleft()

class SystemMonitor:
    """Monitor system resources"""
    
    def __init__(self, metrics_collector: MetricsCollector):
        self.metrics = metrics_collector
        self.start_time = time.time()
    
    def collect_system_metrics(self) -> Dict[str, Any]:
        """Collect system resource metrics"""
        try:
            # CPU metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            cpu_count = psutil.cpu_count()
            
            self.metrics.gauge('system_cpu_percent', cpu_percent)
            self.metrics.gauge('system_cpu_count', cpu_count)
            
            # Memory metrics
            memory = psutil.virtual_memory()
            self.metrics.gauge('system_memory_total', memory.total)
            self.metrics.gauge('system_memory_used', memory.used)
            self.metrics.gauge('system_memory_percent', memory.percent)
            
            # Disk metrics
            disk = psutil.disk_usage('/')
            self.metrics.gauge('system_disk_total', disk.total)
            self.metrics.gauge('system_disk_used', disk.used)
            self.metrics.gauge('system_disk_percent', disk.percent)
            
            # Network metrics
            network = psutil.net_io_counters()
            self.metrics.counter('system_network_bytes_sent', network.bytes_sent)
            self.metrics.counter('system_network_bytes_recv', network.bytes_recv)
            
            # Load average (Unix only)
            load_avg = None
            if hasattr(psutil, 'getloadavg'):
                load_avg = psutil.getloadavg()
                self.metrics.gauge('system_load_1m', load_avg[0])
                self.metrics.gauge('system_load_5m', load_avg[1])
                self.metrics.gauge('system_load_15m', load_avg[2])
            
            # Uptime
            uptime = time.time() - self.start_time
            self.metrics.gauge('system_uptime_seconds', uptime)
            
            return {
                'cpu': {
                    'percent': cpu_percent,
                    'count': cpu_count
                },
                'memory': {
                    'total': memory.total,
                    'used': memory.used,
                    'percent': memory.percent
                },
                'disk': {
                    'total': disk.total,
                    'used': disk.used,
                    'percent': disk.percent
                },
                'network': {
                    'bytes_sent': network.bytes_sent,
                    'bytes_recv': network.bytes_recv
                },
                'load_average': load_avg,
                'uptime': uptime
            }
        
        except Exception as e:
            logger.error(f"Error collecting system metrics: {e}")
            return {}
    
    def collect_gpu_metrics(self) -> Dict[str, Any]:
        """Collect GPU metrics"""
        if not GPU_AVAILABLE:
            return {'available': False, 'reason': 'GPUtil not installed'}
        
        try:
            gpus = GPUtil.getGPUs()
            
            if not gpus:
                return {'available': False, 'reason': 'No GPUs found'}
            
            gpu_data = []
            for i, gpu in enumerate(gpus):
                gpu_info = {
                    'id': gpu.id,
                    'name': gpu.name,
                    'load': gpu.load * 100,
                    'memory_used': gpu.memoryUsed,
                    'memory_total': gpu.memoryTotal,
                    'memory_percent': (gpu.memoryUsed / gpu.memoryTotal) * 100,
                    'temperature': gpu.temperature
                }
                
                # Record metrics
                labels = {'gpu_id': str(gpu.id), 'gpu_name': gpu.name}
                self.metrics.gauge('gpu_load_percent', gpu.load * 100, labels)
                self.metrics.gauge('gpu_memory_used', gpu.memoryUsed, labels)
                self.metrics.gauge('gpu_memory_total', gpu.memoryTotal, labels)
                self.metrics.gauge('gpu_temperature', gpu.temperature, labels)
                
                gpu_data.append(gpu_info)
            
            return {
                'available': True,
                'count': len(gpus),
                'gpus': gpu_data
            }
        
        except Exception as e:
            logger.error(f"Error collecting GPU metrics: {e}")
            return {'available': False, 'error': str(e)}

class ApplicationMonitor:
    """Monitor application-specific metrics"""
    
    def __init__(self, metrics_collector: MetricsCollector):
        self.metrics = metrics_collector
        self.request_times = deque(maxlen=1000)
        self.error_counts = defaultdict(int)
    
    @contextmanager
    def track_request(self, endpoint: str, method: str):
        """Context manager to track request metrics"""
        start_time = time.time()
        labels = {'endpoint': endpoint, 'method': method}
        
        try:
            yield
            # Success
            duration = time.time() - start_time
            self.metrics.histogram('http_request_duration_seconds', duration, labels)
            self.metrics.counter('http_requests_total', 1, {**labels, 'status': 'success'})
            
        except Exception as e:
            # Error
            duration = time.time() - start_time
            error_type = type(e).__name__
            
            self.metrics.histogram('http_request_duration_seconds', duration, labels)
            self.metrics.counter('http_requests_total', 1, {**labels, 'status': 'error'})
            self.metrics.counter('http_errors_total', 1, {**labels, 'error_type': error_type})
            
            raise
    
    def track_pose_estimation(self, processing_time: float, success: bool, media_type: str):
        """Track pose estimation metrics"""
        labels = {'media_type': media_type}
        
        self.metrics.histogram('pose_estimation_duration_seconds', processing_time, labels)
        
        if success:
            self.metrics.counter('pose_estimations_success_total', 1, labels)
        else:
            self.metrics.counter('pose_estimations_error_total', 1, labels)
    
    def track_job_queue(self, queue_name: str, queue_size: int, active_jobs: int):
        """Track job queue metrics"""
        labels = {'queue': queue_name}
        
        self.metrics.gauge('job_queue_size', queue_size, labels)
        self.metrics.gauge('job_queue_active', active_jobs, labels)
    
    def track_cache_hit(self, cache_type: str, hit: bool):
        """Track cache hit/miss metrics"""
        labels = {'cache_type': cache_type}
        
        if hit:
            self.metrics.counter('cache_hits_total', 1, labels)
        else:
            self.metrics.counter('cache_misses_total', 1, labels)
    
    def track_user_activity(self, action: str, user_id: int = None):
        """Track user activity metrics"""
        labels = {'action': action}
        if user_id:
            labels['user_id'] = str(user_id)
        
        self.metrics.counter('user_actions_total', 1, labels)

class HealthChecker:
    """Health check for various system components"""
    
    def __init__(self):
        self.checks = {}
        self.register_default_checks()
    
    def register_check(self, name: str, check_func, timeout: int = 5):
        """Register a health check"""
        self.checks[name] = {
            'func': check_func,
            'timeout': timeout
        }
    
    def register_default_checks(self):
        """Register default health checks"""
        self.register_check('database', self._check_database)
        self.register_check('redis', self._check_redis)
        self.register_check('storage', self._check_storage)
        self.register_check('gpu', self._check_gpu)
    
    def _check_database(self) -> Dict[str, Any]:
        """Check database connectivity"""
        try:
            from .database import get_db
            
            # Try to get a database session
            db = next(get_db())
            db.execute('SELECT 1')
            
            return {
                'status': 'healthy',
                'message': 'Database connection successful'
            }
        
        except Exception as e:
            return {
                'status': 'unhealthy',
                'message': f'Database connection failed: {str(e)}'
            }
    
    def _check_redis(self) -> Dict[str, Any]:
        """Check Redis connectivity"""
        try:
            if cache.is_available:
                cache.redis_client.ping()
                return {
                    'status': 'healthy',
                    'message': 'Redis connection successful'
                }
            else:
                return {
                    'status': 'unhealthy',
                    'message': 'Redis not available'
                }
        
        except Exception as e:
            return {
                'status': 'unhealthy',
                'message': f'Redis connection failed: {str(e)}'
            }
    
    def _check_storage(self) -> Dict[str, Any]:
        """Check storage backend"""
        try:
            from .storage import storage_manager
            
            # Try to list files (basic operation)
            storage_manager.list_files(limit=1)
            
            return {
                'status': 'healthy',
                'message': 'Storage backend accessible'
            }
        
        except Exception as e:
            return {
                'status': 'unhealthy',
                'message': f'Storage check failed: {str(e)}'
            }
    
    def _check_gpu(self) -> Dict[str, Any]:
        """Check GPU availability"""
        try:
            if not GPU_AVAILABLE:
                return {
                    'status': 'warning',
                    'message': 'GPU monitoring not available (GPUtil not installed)'
                }
            
            gpus = GPUtil.getGPUs()
            
            if not gpus:
                return {
                    'status': 'warning',
                    'message': 'No GPUs detected'
                }
            
            # Check if any GPU has high memory usage
            for gpu in gpus:
                if gpu.memoryUsed / gpu.memoryTotal > 0.95:
                    return {
                        'status': 'warning',
                        'message': f'GPU {gpu.id} memory usage high: {gpu.memoryUsed/gpu.memoryTotal*100:.1f}%'
                    }
            
            return {
                'status': 'healthy',
                'message': f'{len(gpus)} GPU(s) available and healthy'
            }
        
        except Exception as e:
            return {
                'status': 'unhealthy',
                'message': f'GPU check failed: {str(e)}'
            }
    
    def run_checks(self) -> Dict[str, Any]:
        """Run all health checks"""
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'overall_status': 'healthy',
            'checks': {}
        }
        
        for name, check_config in self.checks.items():
            try:
                # Run check with timeout
                import signal
                
                def timeout_handler(signum, frame):
                    raise TimeoutError(f"Health check '{name}' timed out")
                
                signal.signal(signal.SIGALRM, timeout_handler)
                signal.alarm(check_config['timeout'])
                
                try:
                    result = check_config['func']()
                    signal.alarm(0)  # Cancel timeout
                except TimeoutError as e:
                    result = {
                        'status': 'unhealthy',
                        'message': str(e)
                    }
                
            except Exception as e:
                result = {
                    'status': 'unhealthy',
                    'message': f'Check failed: {str(e)}'
                }
            
            results['checks'][name] = result
            
            # Update overall status
            if result['status'] == 'unhealthy':
                results['overall_status'] = 'unhealthy'
            elif result['status'] == 'warning' and results['overall_status'] == 'healthy':
                results['overall_status'] = 'warning'
        
        return results

class AlertManager:
    """Manage alerts based on metrics and thresholds"""
    
    def __init__(self, metrics_collector: MetricsCollector):
        self.metrics = metrics_collector
        self.alert_rules = []
        self.active_alerts = {}
        self.setup_default_rules()
    
    def add_rule(self, name: str, metric: str, threshold: float, 
                 operator: str = '>', duration: int = 300):
        """Add alert rule"""
        self.alert_rules.append({
            'name': name,
            'metric': metric,
            'threshold': threshold,
            'operator': operator,
            'duration': duration,
            'triggered_at': None
        })
    
    def setup_default_rules(self):
        """Setup default alert rules"""
        self.add_rule('High CPU Usage', 'system_cpu_percent', 80)
        self.add_rule('High Memory Usage', 'system_memory_percent', 85)
        self.add_rule('High Disk Usage', 'system_disk_percent', 90)
        self.add_rule('High GPU Memory', 'gpu_memory_percent', 90)
        self.add_rule('High Error Rate', 'http_errors_total', 10, '>', 60)
    
    def check_alerts(self) -> List[Dict[str, Any]]:
        """Check all alert rules and return active alerts"""
        current_time = datetime.utcnow()
        alerts = []
        
        for rule in self.alert_rules:
            try:
                # Get current metric value
                metric_data = self.metrics.get_metrics(rule['metric'])
                
                if not metric_data or 'current_value' not in metric_data:
                    continue
                
                current_value = metric_data['current_value']
                threshold = rule['threshold']
                
                # Check condition
                triggered = False
                if rule['operator'] == '>':
                    triggered = current_value > threshold
                elif rule['operator'] == '<':
                    triggered = current_value < threshold
                elif rule['operator'] == '>=':
                    triggered = current_value >= threshold
                elif rule['operator'] == '<=':
                    triggered = current_value <= threshold
                
                if triggered:
                    if rule['name'] not in self.active_alerts:
                        # New alert
                        self.active_alerts[rule['name']] = {
                            'rule': rule,
                            'triggered_at': current_time,
                            'current_value': current_value
                        }
                    
                    # Check if alert should fire (duration passed)
                    alert_data = self.active_alerts[rule['name']]
                    time_diff = (current_time - alert_data['triggered_at']).total_seconds()
                    
                    if time_diff >= rule['duration']:
                        alerts.append({
                            'name': rule['name'],
                            'metric': rule['metric'],
                            'current_value': current_value,
                            'threshold': threshold,
                            'operator': rule['operator'],
                            'duration': time_diff,
                            'severity': self._get_severity(rule['name']),
                            'message': f"{rule['name']}: {rule['metric']} is {current_value} (threshold: {threshold})"
                        })
                else:
                    # Alert resolved
                    if rule['name'] in self.active_alerts:
                        del self.active_alerts[rule['name']]
            
            except Exception as e:
                logger.error(f"Error checking alert rule '{rule['name']}': {e}")
        
        return alerts
    
    def _get_severity(self, alert_name: str) -> str:
        """Get alert severity based on name"""
        if 'High Disk' in alert_name or 'High Memory' in alert_name:
            return 'critical'
        elif 'High CPU' in alert_name or 'High GPU' in alert_name:
            return 'warning'
        elif 'Error Rate' in alert_name:
            return 'critical'
        else:
            return 'info'

# Global instances
metrics_collector = MetricsCollector()
system_monitor = SystemMonitor(metrics_collector)
app_monitor = ApplicationMonitor(metrics_collector)
health_checker = HealthChecker()
alert_manager = AlertManager(metrics_collector)

# Utility functions
def get_prometheus_metrics() -> str:
    """Export metrics in Prometheus format"""
    metrics_data = metrics_collector.get_metrics()
    prometheus_output = []
    
    # Export counters
    for name, value in metrics_data['counters'].items():
        prometheus_output.append(f"# TYPE {name} counter")
        prometheus_output.append(f"{name} {value}")
    
    # Export gauges
    for name, value in metrics_data['gauges'].items():
        prometheus_output.append(f"# TYPE {name} gauge")
        prometheus_output.append(f"{name} {value}")
    
    # Export histograms
    for name, hist_data in metrics_data['histograms'].items():
        prometheus_output.append(f"# TYPE {name} histogram")
        prometheus_output.append(f"{name}_count {hist_data['count']}")
        prometheus_output.append(f"{name}_sum {sum(hist_data['values'])}")
    
    return '\n'.join(prometheus_output)

def start_background_monitoring():
    """Start background monitoring tasks"""
    import threading
    import time
    
    def monitoring_loop():
        while True:
            try:
                # Collect system metrics every 30 seconds
                system_monitor.collect_system_metrics()
                system_monitor.collect_gpu_metrics()
                
                # Check alerts every minute
                alert_manager.check_alerts()
                
                # Clean old metrics every hour
                if int(time.time()) % 3600 == 0:
                    metrics_collector.clear_metrics()
                
                time.sleep(30)
            
            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
                time.sleep(60)  # Wait longer on error
    
    # Start monitoring thread
    monitor_thread = threading.Thread(target=monitoring_loop, daemon=True)
    monitor_thread.start()
    logger.info("Background monitoring started")

def get_system_status() -> Dict[str, Any]:
    """Get comprehensive system status"""
    return {
        'timestamp': datetime.utcnow().isoformat(),
        'health': health_checker.run_checks(),
        'system': system_monitor.collect_system_metrics(),
        'gpu': system_monitor.collect_gpu_metrics(),
        'metrics': metrics_collector.get_metrics(),
        'alerts': alert_manager.check_alerts()
    }