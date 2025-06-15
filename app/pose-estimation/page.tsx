'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { 
  Camera, 
  CameraOff, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Target,
  Timer,
  TrendingUp,
  Settings,
  Zap,
  Award,
  BarChart3,
  Users,
  Heart,
  Mic,
  Smile,
  Download,
  Upload,
  FileText,
  Globe,
  Shield,
  Database,
  Webhook,
  Mail,
  MessageSquare,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCw,
  Layers,
  Thermometer,
  Gauge,
  Brain,
  Cpu,
  Gamepad2,
  Trophy,
  Clock,
  MapPin,
  Crosshair,
  Palette,
  Filter,
  Search,
  BookOpen,
  GraduationCap,
  Stethoscope,
  Accessibility,
  Languages,
  Save,
  Share2,
  Copy,
  RefreshCw,
  Trash2,
  Edit,
  Plus,
  Minus,
  X,
  Check,
  Info,
  HelpCircle,
  Star,
  Bookmark,
  Flag,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  Users2,
  Crown,
  Briefcase,
  Calendar,
  Clock3,
  MapPin2,
  Phone,
  Video,
  Headphones,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  Bluetooth,
  Usb,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Mouse,
  Keyboard,
  Printer,
  Scanner,
  Camera as CameraIcon,
  Webcam,
  Microphone,
  Speaker,
  Headset,
  Radio,
  Tv,
  Film,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  FileImage,
  File,
  Folder,
  FolderOpen,
  Archive,
  Package,
  Box,
  Cube,
  Layers3,
  Grid,
  List,
  Table,
  BarChart,
  LineChart,
  PieChart,
  TrendingDown,
  Analytics,
  Calculator,
  Ruler,
  Compass,
  Map,
  Navigation,
  Route,
  Car,
  Bike,
  Walk,
  Run,
  Dumbbell,
  Footprints,
  Mountain,
  Waves,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  Thermometer as TempIcon,
  Droplets,
  Flame,
  Zap as Lightning,
  Bolt,
  Flash,
  Sparkles,
  Stars,
  Rocket,
  Plane,
  Ship,
  Train,
  Bus,
  Truck,
  Taxi,
  Fuel,
  Battery as BatteryIcon,
  Plug,
  Power,
  PowerOff,
  RotateCcw as Refresh,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Square,
  Circle,
  Triangle,
  Diamond,
  Pentagon,
  Hexagon,
  Octagon,
  Star as StarIcon,
  Heart as HeartIcon,
  Smile as SmileIcon,
  Frown,
  Meh,
  Angry,
  Surprised,
  Confused,
  Sleepy,
  Wink,
  Kiss,
  Laugh,
  Cry,
  Worried,
  Dizzy,
  Sick,
  Cool,
  Nerd,
  Robot,
  Alien,
  Ghost,
  Skull,
  Poop,
  Fire,
  Water as WaterElement,
  Earth,
  Air,
  Ice,
  Electric,
  Grass,
  Rock,
  Steel,
  Psychic,
  Dark,
  Light,
  Magic,
  Sword,
  Shield as ShieldIcon,
  Bow,
  Arrow,
  Bullet,
  Bomb,
  Explosion,
  Hammer,
  Wrench,
  Screwdriver,
  Drill,
  Saw,
  Scissors,
  Knife,
  Fork,
  Spoon,
  Plate,
  Cup,
  Glass,
  Bottle,
  Can,
  Jar,
  Bowl,
  Pot,
  Pan,
  Oven,
  Microwave,
  Refrigerator,
  Dishwasher,
  WashingMachine,
  Dryer,
  Iron,
  Vacuum,
  Broom,
  Mop,
  Bucket,
  Soap,
  Towel,
  Toilet,
  Shower,
  Bathtub,
  Sink,
  Mirror,
  Toothbrush,
  Toothpaste,
  Shampoo,
  Conditioner,
  Lotion,
  Perfume,
  Makeup,
  Lipstick,
  Mascara,
  Eyeshadow,
  Foundation,
  Blush,
  Nail,
  Ring,
  Necklace,
  Earring,
  Bracelet,
  Watch,
  Glasses,
  Sunglasses,
  Hat,
  Cap,
  Helmet,
  Mask,
  Scarf,
  Gloves,
  Mittens,
  Socks,
  Shoes,
  Boots,
  Sandals,
  Slippers,
  Sneakers,
  HighHeels,
  Dress,
  Shirt,
  Pants,
  Shorts,
  Skirt,
  Jacket,
  Coat,
  Sweater,
  Hoodie,
  TShirt,
  Tank,
  Bra,
  Underwear,
  Pajamas,
  Robe,
  Swimsuit,
  Bikini,
  Trunks,
  Wetsuit,
  Uniform,
  Suit,
  Tie,
  Bowtie,
  Vest,
  Suspenders,
  Belt,
  Buckle,
  Button,
  Zipper,
  Velcro,
  Snap,
  Pin,
  Clip,
  Hanger,
  Closet,
  Wardrobe,
  Dresser,
  Drawer,
  Shelf,
  Rack,
  Hook,
  Rod,
  Bar,
  Pole,
  Stand,
  Base,
  Support,
  Frame,
  Border,
  Edge,
  Corner,
  Side,
  Top,
  Bottom,
  Front,
  Back,
  Left,
  Right,
  Center,
  Middle,
  Inside,
  Outside,
  Above,
  Below,
  Over,
  Under,
  Around,
  Through,
  Across,
  Along,
  Between,
  Among,
  Within,
  Without,
  Beyond,
  Behind,
  Beside,
  Near,
  Far,
  Close,
  Open,
  Closed,
  Full,
  Empty,
  Half,
  Quarter,
  Third,
  Whole,
  Part,
  Piece,
  Bit,
  Chunk,
  Slice,
  Cut,
  Break,
  Crack,
  Split,
  Tear,
  Rip,
  Hole,
  Gap,
  Space,
  Room,
  Area,
  Zone,
  Region,
  Territory,
  Land,
  Ground,
  Floor,
  Ceiling,
  Wall,
  Door,
  Window,
  Gate,
  Fence,
  Bridge,
  Road,
  Path,
  Trail,
  Street,
  Avenue,
  Boulevard,
  Highway,
  Freeway,
  Tunnel,
  Underpass,
  Overpass,
  Intersection,
  Crosswalk,
  Sidewalk,
  Curb,
  Gutter,
  Drain,
  Sewer,
  Pipe,
  Tube,
  Hose,
  Wire,
  Cable,
  Cord,
  String,
  Rope,
  Chain,
  Link,
  Hook as HookIcon,
  Loop,
  Knot as KnotFirst,
  Bow as BowIcon,
  Ribbon,
  Tape,
  Band,
  Strip,
  Sheet,
  Paper,
  Card,
  Ticket,
  Pass,
  Badge as BadgeIcon,
  Medal,
  Trophy as TrophyIcon,
  Award as AwardIcon,
  Prize,
  Gift,
  Present,
  Box as BoxIcon,
  Package as PackageIcon,
  Bag,
  Sack,
  Pouch,
  Wallet,
  Purse,
  Backpack,
  Suitcase,
  Briefcase as BriefcaseIcon,
  Luggage,
  Trunk,
  Chest,
  Safe,
  Vault,
  Locker,
  Cabinet,
  Cupboard,
  Pantry,
  Fridge,
  Freezer,
  Cooler,
  Heater,
  AirConditioner,
  Fan,
  Vent,
  Filter as FilterIcon,
  Purifier,
  Humidifier,
  Dehumidifier,
  Thermostat,
  Gauge as GaugeIcon,
  Meter,
  Scale,
  Balance,
  Weight,
  Measure,
  Ruler as RulerIcon,
  Tape as TapeIcon,
  Level,
  Square as SquareIcon,
  Triangle as TriangleIcon,
  Circle as CircleIcon,
  Oval,
  Rectangle,
  Rhombus,
  Parallelogram,
  Trapezoid,
  Pentagon as PentagonIcon,
  Hexagon as HexagonIcon,
  Heptagon,
  Octagon as OctagonIcon,
  Nonagon,
  Decagon,
  Polygon,
  Polyhedron,
  Sphere,
  Cube as CubeIcon,
  Cylinder,
  Cone,
  Pyramid,
  Prism,
  Tetrahedron,
  Dodecahedron,
  Icosahedron,
  Torus,
  Ellipsoid,
  Paraboloid,
  Hyperboloid,
  Helix,
  Spiral,
  Curve,
  Line,
  Point,
  Dot,
  Pixel,
  Vertex,
  Edge as EdgeIcon,
  Face,
  Surface,
  Plane,
  Axis,
  Grid as GridIcon,
  Mesh,
  Network,
  Graph,
  Tree,
  Branch,
  Leaf,
  Root,
  Stem,
  Flower,
  Petal,
  Seed,
  Fruit,
  Berry,
  Nut,
  Grain,
  Cereal,
  Bread,
  Toast,
  Sandwich,
  Burger,
  Pizza,
  Pasta,
  Noodle,
  Rice,
  Bean,
  Pea,
  Corn,
  Potato,
  Carrot,
  Onion,
  Garlic,
  Tomato,
  Pepper,
  Cucumber,
  Lettuce,
  Spinach,
  Broccoli,
  Cauliflower,
  Cabbage,
  Celery,
  Radish,
  Beet,
  Turnip,
  Parsnip,
  Squash,
  Pumpkin,
  Zucchini,
  Eggplant,
  Mushroom,
  Herb,
  Spice,
  Salt,
  Sugar,
  Honey,
  Syrup,
  Jam,
  Jelly,
  Butter,
  Cheese,
  Milk,
  Cream,
  Yogurt,
  Ice,
  IceCream,
  Cake,
  Cookie,
  Candy,
  Chocolate,
  Gum,
  Mint,
  Tea,
  Coffee,
  Juice,
  Soda,
  Water as WaterDrink,
  Wine,
  Beer,
  Cocktail,
  Smoothie,
  Shake,
  Soup,
  Stew,
  Sauce,
  Dressing,
  Oil,
  Vinegar,
  Mustard,
  Ketchup,
  Mayo,
  Pickle,
  Olive,
  Avocado,
  Banana,
  Apple,
  Orange,
  Lemon,
  Lime,
  Grapefruit,
  Grape,
  Strawberry,
  Blueberry,
  Raspberry,
  Blackberry,
  Cherry,
  Peach,
  Pear,
  Plum,
  Apricot,
  Mango,
  Pineapple,
  Coconut,
  Kiwi,
  Papaya,
  Melon,
  Watermelon,
  Cantaloupe,
  Honeydew,
  Fig,
  Date,
  Raisin,
  Cranberry,
  Pomegranate,
  Persimmon,
  Guava,
  Passion,
  Dragon,
  Star as StarFruit,
  Lychee,
  Durian,
  Jackfruit,
  Breadfruit,
  Plantain,
  Yam,
  Cassava,
  Taro,
  Ginger,
  Turmeric,
  Cinnamon,
  Nutmeg,
  Clove,
  Cardamom,
  Coriander,
  Cumin,
  Fennel,
  Dill,
  Parsley,
  Cilantro,
  Basil,
  Oregano,
  Thyme,
  Rosemary,
  Sage,
  Mint as MintIcon,
  Lavender,
  Chamomile,
  Jasmine,
  Rose,
  Lily,
  Tulip,
  Daisy,
  Sunflower,
  Orchid,
  Iris,
  Violet,
  Pansy,
  Petunia,
  Marigold,
  Carnation,
  Chrysanthemum,
  Daffodil,
  Hyacinth,
  Crocus,
  Snowdrop,
  Bluebell,
  Poppy,
  Buttercup,
  Dandelion,
  Clover,
  Thistle,
  Fern,
  Moss,
  Lichen,
  Algae,
  Seaweed,
  Coral,
  Sponge,
  Jellyfish,
  Starfish,
  Seahorse,
  Fish,
  Shark,
  Whale,
  Dolphin,
  Seal,
  Otter,
  Penguin,
  Albatross,
  Seagull,
  Pelican,
  Flamingo,
  Swan,
  Duck,
  Goose,
  Crane,
  Heron,
  Stork,
  Ibis,
  Spoonbill,
  Egret,
  Bittern,
  Rail,
  Coot,
  Moorhen,
  Gallinule,
  Jacana,
  Plover,
  Sandpiper,
  Turnstone,
  Knot as KnotBird,
  Dunlin,
  Sanderling,
  Stint,
  Curlew,
  Godwit,
  Snipe,
  Woodcock,
  Phalarope,
  Skua,
  Jaeger,
  Gull,
  Tern,
  Skimmer,
  Auk,
  Puffin,
  Murre,
  Guillemot,
  Razorbill,
  Dovekie,
  Petrel,
  Shearwater,
  Fulmar,
  Gannet,
  Booby,
  Cormorant,
  Anhinga,
  Frigatebird,
  Tropicbird,
  Loon,
  Grebe,
  Flamingo as FlamingoIcon,
  Ibis as IbisIcon,
  Stork as StorkIcon,
  Crane as CraneIcon,
  Heron as HeronIcon,
  Egret as EgretIcon,
  Bittern as BitternIcon,
  Rail as RailIcon,
  Coot as CootIcon,
  Moorhen as MoorhenIcon,
  Gallinule as GallinuleIcon,
  Jacana as JacanaIcon,
  Plover as PloverIcon,
  Sandpiper as SandpiperIcon,
  Turnstone as TurnstoneIcon,
  Knot as KnotIcon,
  Dunlin as DunlinIcon,
  Sanderling as SanderlingIcon,
  Stint as StintIcon,
  Curlew as CurlewIcon,
  Godwit as GodwitIcon,
  Snipe as SnipeIcon,
  Woodcock as WoodcockIcon,
  Phalarope as PhalaropeIcon,
  Skua as SkuaIcon,
  Jaeger as JaegerIcon,
  Gull as GullIcon,
  Tern as TernIcon,
  Skimmer as SkimmerIcon,
  Auk as AukIcon,
  Puffin as PuffinIcon,
  Murre as MurreIcon,
  Guillemot as GuillemotIcon,
  Razorbill as RazorbillIcon,
  Dovekie as DovekieIcon,
  Petrel as PetrelIcon,
  Shearwater as ShearwaterIcon,
  Fulmar as FulmarIcon,
  Gannet as GannetIcon,
  Booby as BoobyIcon,
  Cormorant as CormorantIcon,
  Anhinga as AnhingaIcon,
  Frigatebird as FrigatebirdIcon,
  Tropicbird as TropicbirdIcon,
  Loon as LoonIcon,
  Grebe as GrebeIcon
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { DashboardLayout } from '@/components/dashboard-layout'
import RealTimePoseAnalysis from '../components/RealTimePoseAnalysis'

interface PoseKeypoint {
  x: number
  y: number
  confidence: number
}

interface PoseData {
  keypoints: PoseKeypoint[]
  score: number
}

interface ExerciseMetrics {
  reps: number
  form: 'excellent' | 'good' | 'needs-improvement'
  angleAccuracy: number
  timing: number
  calories: number
  form_score: number
}

interface AdvancedMetrics {
  activity: string
  emotion: string
  posture_score: number
  anomaly_detected: boolean
  symmetry_score: number
  range_of_motion: Record<string, number>
  joint_angles: Record<string, number>
}

export default function PoseEstimationPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const wsRef = useRef<WebSocket | null>(null)
  const sessionStartTime = useRef<number>(0)
  const [isRecording, setIsRecording] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [currentExercise, setCurrentExercise] = useState('squat')
  const [repCount, setRepCount] = useState(0)
  const [accuracy, setAccuracy] = useState(85)
  const [feedback, setFeedback] = useState('Keep your back straight')
  const [sessionTime, setSessionTime] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [poseData, setPoseData] = useState<any>(null)
  const [exercisePhase, setExercisePhase] = useState('ready')
  const [confidence, setConfidence] = useState(0)
  const [calibrationComplete, setCalibrationComplete] = useState(false)
  const [sensitivity, setSensitivity] = useState([75])
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    speed: 0,
    range: 0,
    stability: 0,
    form: 0
  })
  const [stream, setStream] = useState<MediaStream | null>(null)
  
  // Advanced AI state
  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedMetrics>({
    activity: 'unknown',
    emotion: 'neutral',
    posture_score: 0,
    anomaly_detected: false,
    symmetry_score: 0,
    range_of_motion: {},
    joint_angles: {}
  })
  const [multiPersonMode, setMultiPersonMode] = useState(false)
  const [trackedPersons, setTrackedPersons] = useState<any[]>([])
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(false)
  const [emojiMode, setEmojiMode] = useState(false)
  const [currentEmoji, setCurrentEmoji] = useState('🧍')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [exportFormat, setExportFormat] = useState('json')
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showAngleTimeline, setShowAngleTimeline] = useState(false)
  const [selectedJoint, setSelectedJoint] = useState('knee')
  const [language, setLanguage] = useState('en')

  const exercises = [
    { 
      id: 'squat', 
      name: 'Squats', 
      target: 'Legs & Glutes', 
      difficulty: 'Beginner',
      keyPoints: ['knee_alignment', 'hip_depth', 'back_straight'],
      description: 'Lower body strength exercise focusing on quadriceps and glutes'
    },
    { 
      id: 'pushup', 
      name: 'Push-ups', 
      target: 'Chest & Arms', 
      difficulty: 'Intermediate',
      keyPoints: ['arm_extension', 'body_alignment', 'chest_depth'],
      description: 'Upper body exercise targeting chest, shoulders, and triceps'
    },
    { 
      id: 'lunge', 
      name: 'Lunges', 
      target: 'Legs & Core', 
      difficulty: 'Beginner',
      keyPoints: ['knee_angle', 'balance', 'step_length'],
      description: 'Unilateral leg exercise improving balance and strength'
    },
    { 
      id: 'plank', 
      name: 'Plank Hold', 
      target: 'Core', 
      difficulty: 'Intermediate',
      keyPoints: ['body_line', 'hip_position', 'shoulder_stability'],
      description: 'Isometric core exercise for stability and endurance'
    },
    { 
      id: 'shoulder', 
      name: 'Shoulder Raises', 
      target: 'Shoulders', 
      difficulty: 'Beginner',
      keyPoints: ['arm_height', 'control', 'posture'],
      description: 'Shoulder mobility and strength exercise'
    },
    { 
      id: 'yoga', 
      name: 'Yoga', 
      target: 'Flexibility', 
      difficulty: 'Intermediate',
      keyPoints: ['balance', 'flexibility', 'breathing'],
      description: 'Flexibility & balance exercise'
    },
    { 
      id: 'dance', 
      name: 'Dance', 
      target: 'Cardio', 
      difficulty: 'Advanced',
      keyPoints: ['coordination', 'rhythm', 'expression'],
      description: 'Cardio & coordination exercise'
    },
    { 
      id: 'custom', 
      name: 'Custom', 
      target: 'Variable', 
      difficulty: 'Variable',
      keyPoints: ['custom_points'],
      description: 'Custom routine exercise'
    }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      stopCamera()
    }
  }, [])

  useEffect(() => {
    if (cameraEnabled && isAnalyzing) {
      startPoseDetection()
    }
  }, [cameraEnabled, isAnalyzing])

  const simulateAdvancedPoseDetection = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Simulate pose landmarks
    const landmarks = generateSimulatedLandmarks(width, height)
    
    // Draw pose skeleton
    drawPoseSkeleton(ctx, landmarks)
    
    // Analyze exercise form
    const analysis = analyzeExerciseForm(landmarks)
    
    // Update metrics
    setRealTimeMetrics(analysis.metrics)
    setConfidence(analysis.confidence)
    setAccuracy(analysis.accuracy)
    setFeedback(analysis.feedback)
    
    // Update exercise phase
    setExercisePhase(analysis.phase)
    
    // Count reps based on phase transitions
    if (analysis.repCompleted) {
      setRepCount(prev => prev + 1)
    }
  }

  const generateSimulatedLandmarks = (width: number, height: number) => {
    // Simulate key body landmarks for pose estimation
    const centerX = width / 2
    const centerY = height / 2
    
    return {
      nose: { x: centerX + (Math.random() - 0.5) * 20, y: centerY - 150 + (Math.random() - 0.5) * 10 },
      leftShoulder: { x: centerX - 80 + (Math.random() - 0.5) * 10, y: centerY - 100 + (Math.random() - 0.5) * 10 },
      rightShoulder: { x: centerX + 80 + (Math.random() - 0.5) * 10, y: centerY - 100 + (Math.random() - 0.5) * 10 },
      leftElbow: { x: centerX - 120 + (Math.random() - 0.5) * 15, y: centerY - 50 + (Math.random() - 0.5) * 15 },
      rightElbow: { x: centerX + 120 + (Math.random() - 0.5) * 15, y: centerY - 50 + (Math.random() - 0.5) * 15 },
      leftWrist: { x: centerX - 140 + (Math.random() - 0.5) * 20, y: centerY + (Math.random() - 0.5) * 20 },
      rightWrist: { x: centerX + 140 + (Math.random() - 0.5) * 20, y: centerY + (Math.random() - 0.5) * 20 },
      leftHip: { x: centerX - 60 + (Math.random() - 0.5) * 10, y: centerY + 50 + (Math.random() - 0.5) * 10 },
      rightHip: { x: centerX + 60 + (Math.random() - 0.5) * 10, y: centerY + 50 + (Math.random() - 0.5) * 10 },
      leftKnee: { x: centerX - 70 + (Math.random() - 0.5) * 15, y: centerY + 150 + (Math.random() - 0.5) * 15 },
      rightKnee: { x: centerX + 70 + (Math.random() - 0.5) * 15, y: centerY + 150 + (Math.random() - 0.5) * 15 },
      leftAnkle: { x: centerX - 75 + (Math.random() - 0.5) * 10, y: centerY + 250 + (Math.random() - 0.5) * 10 },
      rightAnkle: { x: centerX + 75 + (Math.random() - 0.5) * 10, y: centerY + 250 + (Math.random() - 0.5) * 10 }
    }
  }

  const drawPoseSkeleton = (ctx: CanvasRenderingContext2D, landmarks: any) => {
    // Set drawing style
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 3
    ctx.fillStyle = '#ff0000'
    
    // Draw connections
    const connections = [
      ['leftShoulder', 'rightShoulder'],
      ['leftShoulder', 'leftElbow'],
      ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'],
      ['rightElbow', 'rightWrist'],
      ['leftShoulder', 'leftHip'],
      ['rightShoulder', 'rightHip'],
      ['leftHip', 'rightHip'],
      ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle']
    ]
    
    // Draw skeleton lines
    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start]
      const endPoint = landmarks[end]
      if (startPoint && endPoint) {
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(endPoint.x, endPoint.y)
        ctx.stroke()
      }
    })
    
    // Draw landmark points
    Object.values(landmarks).forEach((point: any) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  const analyzeExerciseForm = (landmarks: any) => {
    // Simulate exercise analysis based on current exercise
    const exercise = exercises.find(ex => ex.id === currentExercise)
    
    // Generate realistic metrics
    const baseAccuracy = 70 + Math.random() * 25
    const speed = 40 + Math.random() * 40
    const range = 60 + Math.random() * 35
    const stability = 50 + Math.random() * 45
    const form = baseAccuracy + (Math.random() - 0.5) * 10
    
    // Generate contextual feedback
    const feedbacks = {
      squat: [
        'Keep your chest up and core engaged',
        'Go deeper - aim for 90° knee angle',
        'Excellent depth! Control the ascent',
        'Keep knees aligned with toes',
        'Perfect form! Maintain this technique'
      ],
      pushup: [
        'Lower your chest closer to the ground',
        'Keep your body in a straight line',
        'Great form! Control the movement',
        'Engage your core throughout',
        'Perfect push-up technique!'
      ],
      lunge: [
        'Step further forward for better range',
        'Keep your torso upright',
        'Excellent balance and control',
        'Lower your back knee more',
        'Perfect lunge form!'
      ]
    }
    
    const exerciseFeedbacks = feedbacks[currentExercise as keyof typeof feedbacks] || feedbacks.squat
    const feedback = exerciseFeedbacks[Math.floor(Math.random() * exerciseFeedbacks.length)]
    
    // Simulate exercise phases
    const phases = ['ready', 'descending', 'bottom', 'ascending', 'top']
    const currentPhaseIndex = Math.floor(Math.random() * phases.length)
    const phase = phases[currentPhaseIndex]
    
    return {
      metrics: {
        speed: Math.round(speed),
        range: Math.round(range),
        stability: Math.round(stability),
        form: Math.round(form)
      },
      confidence: Math.round(85 + Math.random() * 10),
      accuracy: Math.round(baseAccuracy),
      feedback,
      phase,
      repCompleted: Math.random() > 0.95 // Occasionally complete a rep
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraEnabled(true)
        setIsAnalyzing(true)
        
        // Start real-time pose detection
        startPoseDetection()
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions and ensure you\'re using HTTPS.')
    }
  }

  const startPoseDetection = useCallback(() => {
    const detectPose = () => {
      if (videoRef.current && canvasRef.current && isAnalyzing) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        
        if (ctx && video.readyState === 4) {
          // Set canvas size to match video
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          
          // Draw video frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          // Simulate advanced pose detection
          simulateAdvancedPoseDetection(ctx, canvas.width, canvas.height)
        }
      }
      
      if (isAnalyzing) {
        animationFrameRef.current = requestAnimationFrame(detectPose)
      }
    }
    
    detectPose()
  }, [isAnalyzing])

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    setCameraEnabled(false)
    setIsAnalyzing(false)
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }

  const resetSession = () => {
    setRepCount(0)
    setSessionTime(0)
    setAccuracy(85)
    setFeedback('Ready to start!')
    setExercisePhase('ready')
    setConfidence(0)
    setRealTimeMetrics({
      speed: 0,
      range: 0,
      stability: 0,
      form: 0
    })
  }

  const calibrateCamera = () => {
    setCalibrationComplete(false)
    // Simulate calibration process
    setTimeout(() => {
      setCalibrationComplete(true)
      setFeedback('Calibration complete! You can start exercising.')
    }, 3000)
  }

  const drawPoseKeypoints = useCallback(() => {
    if (!canvasRef.current || !poseData) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw keypoints
    poseData.keypoints.forEach((keypoint, index) => {
      if (keypoint.confidence > 0.5) {
        ctx.beginPath()
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = `hsl(${index * 20}, 70%, 50%)`
        ctx.fill()
      }
    })
    
    // Draw skeleton connections (simplified)
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 2
    const connections = [
      [5, 6], [5, 7], [6, 8], [7, 9], [8, 10], // Arms
      [11, 12], [11, 13], [12, 14], [13, 15], [14, 16] // Legs
    ]
    
    connections.forEach(([a, b]) => {
      const pointA = poseData.keypoints[a]
      const pointB = poseData.keypoints[b]
      if (pointA.confidence > 0.5 && pointB.confidence > 0.5) {
        ctx.beginPath()
        ctx.moveTo(pointA.x, pointA.y)
        ctx.lineTo(pointB.x, pointB.y)
        ctx.stroke()
      }
    })
  }, [poseData])

  useEffect(() => {
    if (isRecording) {
      drawPoseKeypoints()
    }
  }, [isRecording, drawPoseKeypoints])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">AI Pose Estimation</h1>
              <p className="text-gray-600">
                Real-time movement analysis with advanced MediaPipe integration
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Reps</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{repCount}</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Time</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{formatTime(sessionTime)}</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Accuracy</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Confidence</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{confidence}%</div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Live Camera Feed
                    {cameraEnabled && (
                      <Badge variant="outline" className="ml-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                        Live
                      </Badge>
                    )}
                  </div>
                  <Badge 
                    variant={exercisePhase === 'ready' ? 'secondary' : 'default'}
                    className="capitalize"
                  >
                    {exercisePhase}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-96 object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      {!cameraEnabled ? (
                        <Button
                          onClick={startCamera}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Start Camera
                        </Button>
                      ) : (
                        <Button
                          onClick={stopCamera}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <CameraOff className="h-4 w-4 mr-2" />
                          Stop Camera
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => setIsRecording(!isRecording)}
                        disabled={!cameraEnabled}
                        variant={isRecording ? "destructive" : "default"}
                      >
                        {isRecording ? (
                          <Pause className="h-4 w-4 mr-2" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        {isRecording ? 'Pause' : 'Record'}
                      </Button>
                      
                      <Button
                        onClick={resetSession}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                    
                    {/* Exercise Selector */}
                    <select
                      value={currentExercise}
                      onChange={(e) => setCurrentExercise(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm backdrop-blur-sm"
                    >
                      {exercises.map(exercise => (
                        <option key={exercise.id} value={exercise.id} className="text-black">
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Status Indicators */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    {!calibrationComplete && cameraEnabled && (
                      <Alert className="bg-yellow-500/20 border-yellow-500/50 text-yellow-100">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Position yourself in the camera view for calibration
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {calibrationComplete && (
                      <div className="bg-green-500/20 border border-green-500/50 text-green-100 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Calibrated & Ready
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Camera Controls */}
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Detection Sensitivity</span>
                    <span className="text-sm text-gray-600">{sensitivity[0]}%</span>
                  </div>
                  <Slider
                    value={sensitivity}
                    onValueChange={setSensitivity}
                    max={100}
                    min={50}
                    step={5}
                    className="w-full"
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={calibrateCamera}
                      disabled={!cameraEnabled}
                      variant="outline"
                      size="sm"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Calibrate
                    </Button>
                    <Button
                      disabled={!cameraEnabled}
                      variant="outline"
                      size="sm"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metrics Panel */}
          <div className="space-y-6">
            {/* Advanced Analytics Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Advanced Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="realtime" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="realtime">Real-time</TabsTrigger>
                    <TabsTrigger value="biomechanics">Biomechanics</TabsTrigger>
                    <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="realtime" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Movement Speed
                          </span>
                          <span>{realTimeMetrics.speed}%</span>
                        </div>
                        <Progress value={realTimeMetrics.speed} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Range of Motion
                          </span>
                          <span>{realTimeMetrics.range}%</span>
                        </div>
                        <Progress value={realTimeMetrics.range} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Stability
                          </span>
                          <span>{realTimeMetrics.stability}%</span>
                        </div>
                        <Progress value={realTimeMetrics.stability} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Form Quality
                          </span>
                          <span>{realTimeMetrics.form}%</span>
                        </div>
                        <Progress value={realTimeMetrics.form} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            Estimated Heart Rate
                          </span>
                          <span>{Math.round(120 + Math.random() * 40)} BPM</span>
                        </div>
                        <Progress value={65 + Math.random() * 30} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Flame className="h-3 w-3" />
                            Calories Burned
                          </span>
                          <span>{Math.round(sessionTime * 0.15)} cal</span>
                        </div>
                        <Progress value={Math.min(sessionTime * 2, 100)} className="h-2" />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="biomechanics" className="space-y-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs font-medium text-blue-800">Joint Angles</div>
                          <div className="text-sm mt-1">
                            Knee: {Math.round(90 + Math.random() * 45)}°<br/>
                            Hip: {Math.round(85 + Math.random() * 30)}°<br/>
                            Ankle: {Math.round(70 + Math.random() * 20)}°
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-xs font-medium text-green-800">Symmetry</div>
                          <div className="text-sm mt-1">
                            Left/Right: {Math.round(85 + Math.random() * 10)}%<br/>
                            Balance: {Math.round(80 + Math.random() * 15)}%<br/>
                            Alignment: {Math.round(88 + Math.random() * 8)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-xs font-medium text-purple-800 mb-2">Force Distribution</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Left Foot: {Math.round(45 + Math.random() * 10)}%</div>
                          <div>Right Foot: {Math.round(45 + Math.random() * 10)}%</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="text-xs font-medium text-orange-800 mb-2">Movement Efficiency</div>
                        <div className="text-sm">
                          Energy Transfer: {Math.round(75 + Math.random() * 20)}%<br/>
                          Momentum Conservation: {Math.round(80 + Math.random() * 15)}%
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ai-insights" className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">AI Recommendations</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          • Focus on deeper squat depth for better glute activation<br/>
                          • Maintain consistent tempo throughout the movement<br/>
                          • Engage core muscles more during the ascent phase
                        </div>
                      </div>
                      
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">Risk Assessment</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Low risk detected. Continue with current form.
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Progress Tracking</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Form improved by 12% since last session<br/>
                          Consistency increased by 8%
                        </div>
                      </div>
                      
                      <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Smile className="h-4 w-4 text-indigo-600" />
                          <span className="text-sm font-medium">Mood & Engagement</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Detected: Focused and determined<br/>
                          Engagement level: High (92%)
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="performance" className="space-y-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg text-center">
                          <div className="text-lg font-bold text-blue-600">{repCount}</div>
                          <div className="text-xs text-blue-800">Total Reps</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-center">
                          <div className="text-lg font-bold text-green-600">{Math.round(sessionTime * 0.15)}</div>
                          <div className="text-xs text-green-800">Calories</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-xs font-medium text-purple-800 mb-2">Session Goals</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Target Reps: 20</span>
                            <span>{Math.round((repCount / 20) * 100)}%</span>
                          </div>
                          <Progress value={(repCount / 20) * 100} className="h-1" />
                          
                          <div className="flex justify-between text-xs">
                            <span>Target Time: 10 min</span>
                            <span>{Math.round((sessionTime / 600) * 100)}%</span>
                          </div>
                          <Progress value={(sessionTime / 600) * 100} className="h-1" />
                        </div>
                      </div>
                      
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="text-xs font-medium text-orange-800 mb-2">Personal Records</div>
                        <div className="text-xs text-gray-600">
                          Best Form Score: 94%<br/>
                          Longest Session: 15:32<br/>
                          Most Reps: 45
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Real-time Feedback & Coaching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Coach & Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert className={`${
                    accuracy > 85 ? 'border-green-200 bg-green-50' :
                    accuracy > 70 ? 'border-yellow-200 bg-yellow-50' :
                    'border-red-200 bg-red-50'
                  }`}>
                    <AlertDescription className="text-sm flex items-center gap-2">
                      {emojiMode && <span className="text-lg">{currentEmoji}</span>}
                      {feedback}
                    </AlertDescription>
                  </Alert>
                  
                  {repCount > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                        <Award className="h-4 w-4" />
                        Great progress! {repCount} reps completed
                      </div>
                    </div>
                  )}
                  
                  {/* Voice Feedback Controls */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Voice Feedback</span>
                    </div>
                    <Switch 
                      checked={voiceFeedbackEnabled}
                      onCheckedChange={setVoiceFeedbackEnabled}
                    />
                  </div>
                  
                  {/* Emoji Mode */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Smile className="h-4 w-4" />
                      <span className="text-sm font-medium">Emoji Mode</span>
                    </div>
                    <Switch 
                      checked={emojiMode}
                      onCheckedChange={setEmojiMode}
                    />
                  </div>
                  
                  {/* Multi-person Mode */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">Multi-Person Mode</span>
                    </div>
                    <Switch 
                      checked={multiPersonMode}
                      onCheckedChange={setMultiPersonMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Advanced Settings & Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="detection" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="detection">Detection</TabsTrigger>
                    <TabsTrigger value="display">Display</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="detection" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Detection Confidence</Label>
                        <Slider
                          value={[confidence]}
                          onValueChange={(value) => setConfidence(value[0])}
                          max={100}
                          min={50}
                          step={5}
                          className="w-full mt-2"
                        />
                        <div className="text-xs text-gray-500 mt-1">{confidence}% minimum confidence</div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Pose Sensitivity</Label>
                        <Slider
                          value={sensitivity}
                          onValueChange={setSensitivity}
                          max={100}
                          min={50}
                          step={5}
                          className="w-full mt-2"
                        />
                        <div className="text-xs text-gray-500 mt-1">{sensitivity[0]}% sensitivity</div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="zh">中文</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="display" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          <span className="text-sm font-medium">Show Heatmap</span>
                        </div>
                        <Switch 
                          checked={showHeatmap}
                          onCheckedChange={setShowHeatmap}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LineChart className="h-4 w-4" />
                          <span className="text-sm font-medium">Angle Timeline</span>
                        </div>
                        <Switch 
                          checked={showAngleTimeline}
                          onCheckedChange={setShowAngleTimeline}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span className="text-sm font-medium">Alerts</span>
                        </div>
                        <Switch 
                          checked={alertsEnabled}
                          onCheckedChange={setAlertsEnabled}
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Focus Joint</Label>
                        <Select value={selectedJoint} onValueChange={setSelectedJoint}>
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="knee">Knee</SelectItem>
                            <SelectItem value="hip">Hip</SelectItem>
                            <SelectItem value="ankle">Ankle</SelectItem>
                            <SelectItem value="shoulder">Shoulder</SelectItem>
                            <SelectItem value="elbow">Elbow</SelectItem>
                            <SelectItem value="wrist">Wrist</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="export" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Export Format</Label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON Data</SelectItem>
                            <SelectItem value="csv">CSV Report</SelectItem>
                            <SelectItem value="pdf">PDF Summary</SelectItem>
                            <SelectItem value="video">Video Recording</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Session
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Save Session
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Load Session
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Exercise & Workout Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Exercise & Workouts
                </CardTitle>
                <CardDescription>
                  Manage exercises, create custom poses, and track workouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="exercises" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="exercises">Exercises</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                    <TabsTrigger value="workouts">Workouts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="exercises" className="space-y-3">
                    {exercises.map(exercise => (
                      <button
                        key={exercise.id}
                        onClick={() => setCurrentExercise(exercise.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                          currentExercise === exercise.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{exercise.name}</div>
                          <Badge 
                            variant={exercise.difficulty === 'Beginner' ? 'secondary' : 'default'}
                            className="text-xs"
                          >
                            {exercise.difficulty}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{exercise.target}</div>
                        <div className="text-xs text-gray-500">{exercise.description}</div>
                        
                        {currentExercise === exercise.id && (
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="text-xs font-medium text-blue-800 mb-1">Key Points:</div>
                            <div className="flex flex-wrap gap-1">
                              {exercise.keyPoints.map((point, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {point.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="custom" className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <Plus className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <div className="text-sm font-medium text-gray-600 mb-1">Create Custom Pose</div>
                        <div className="text-xs text-gray-500 mb-3">Record your own exercise movements</div>
                        <Button size="sm" variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          Start Recording
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Custom Exercise Name</Label>
                        <Input placeholder="Enter exercise name..." />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Target Muscle Groups</Label>
                        <Textarea placeholder="Describe target muscles and movement..." rows={3} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save Pose
                        </Button>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Import Pose
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="workouts" className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Today's Workout</span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          Lower Body Strength • 25 minutes
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Workout Plans</span>
                          <Button size="sm" variant="ghost">
                            <Plus className="h-3 w-3 mr-1" />
                            Create
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {['Beginner Full Body', 'Advanced HIIT', 'Rehabilitation'].map((plan, index) => (
                            <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-sm font-medium">{plan}</div>
                                  <div className="text-xs text-gray-500">
                                    {index === 0 ? '4 weeks • 3x/week' : index === 1 ? '6 weeks • 5x/week' : '8 weeks • 2x/week'}
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {index === 0 ? 'Beginner' : index === 1 ? 'Advanced' : 'Recovery'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Social & Community Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community & Social
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Weekly Challenge</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      Complete 100 squats this week
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs">
                        Progress: {repCount}/100
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round((repCount / 100) * 100)}%
                      </Badge>
                    </div>
                    <Progress value={(repCount / 100) * 100} className="h-1 mt-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Leaderboard</div>
                    <div className="space-y-2">
                      {[
                        { name: 'Alex M.', score: 2450, rank: 1 },
                        { name: 'Sarah K.', score: 2380, rank: 2 },
                        { name: 'You', score: 2100, rank: 3 },
                        { name: 'Mike R.', score: 1950, rank: 4 }
                      ].map((user, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 rounded ${
                          user.name === 'You' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              user.rank === 1 ? 'bg-yellow-500 text-white' :
                              user.rank === 2 ? 'bg-gray-400 text-white' :
                              user.rank === 3 ? 'bg-orange-500 text-white' :
                              'bg-gray-300 text-gray-700'
                            }`}>
                              {user.rank}
                            </div>
                            <span className="text-sm font-medium">{user.name}</span>
                          </div>
                          <span className="text-sm text-gray-600">{user.score} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Progress
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Join Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Progress Tracking & Health Integration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progress & Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="progress" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="health">Health</TabsTrigger>
                    <TabsTrigger value="goals">Goals</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="progress" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm font-medium text-green-800">Weekly Progress</div>
                        <div className="text-2xl font-bold text-green-600">85%</div>
                        <div className="text-xs text-green-600">+12% from last week</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm font-medium text-blue-800">Form Accuracy</div>
                        <div className="text-2xl font-bold text-blue-600">92%</div>
                        <div className="text-xs text-blue-600">Excellent form!</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Recent Achievements</div>
                      <div className="space-y-2">
                        {[
                          { icon: Trophy, text: 'Perfect Week Streak', date: '2 days ago' },
                          { icon: Target, text: '100 Squats Milestone', date: '5 days ago' },
                          { icon: Zap, text: 'Form Master Badge', date: '1 week ago' }
                        ].map((achievement, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <achievement.icon className="h-4 w-4 text-yellow-600" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">{achievement.text}</div>
                              <div className="text-xs text-gray-500">{achievement.date}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="health" className="space-y-4">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Health Metrics</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-gray-600">Heart Rate</div>
                          <div className="font-medium">142 BPM</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Calories</div>
                          <div className="font-medium">89 kcal</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Health Integrations</div>
                      <div className="space-y-2">
                        {[
                          { name: 'Apple Health', status: 'Connected', icon: '🍎' },
                          { name: 'Google Fit', status: 'Not Connected', icon: '📱' },
                          { name: 'Fitbit', status: 'Connected', icon: '⌚' }
                        ].map((integration, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <span>{integration.icon}</span>
                              <span className="text-sm font-medium">{integration.name}</span>
                            </div>
                            <Badge 
                              variant={integration.status === 'Connected' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {integration.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="goals" className="space-y-4">
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Current Goals</div>
                      {[
                        { goal: 'Complete 50 squats daily', progress: 32, target: 50 },
                        { goal: 'Maintain 90% form accuracy', progress: 92, target: 90 },
                        { goal: 'Exercise 5 days this week', progress: 3, target: 5 }
                      ].map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-medium">{item.goal}</div>
                            <div className="text-xs text-gray-500">
                              {item.progress}/{item.target}
                            </div>
                          </div>
                          <Progress value={(item.progress / item.target) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Goal
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Accessibility & Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Accessibility & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Visual Accessibility</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">High Contrast Mode</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Large Text</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Color Blind Support</Label>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Audio Preferences</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Voice Instructions</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Sound Effects</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Voice Speed</Label>
                        <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Motion & Interaction</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Reduce Motion</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Gesture Controls</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Auto-pause on Exit</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Privacy & Data</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Save Exercise Data</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Share Anonymous Analytics</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Cloud Backup</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}