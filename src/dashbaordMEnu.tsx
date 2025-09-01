import {
  Dashboard,
  People,
  Class as ClassIcon,
  Campaign as CampaignIcon,
  AccountCircle
} from "@mui/icons-material";


export const TeacherMenu = [
  { text: "Home", icon: <Dashboard />, path: "/dashboard/tea/home" },
  { text: "Batch", icon: <People />, path: "/dashboard/tea/batch" },
  { text: "Class", icon: <ClassIcon />, path: "/dashboard/tea/class" },
  { text: "Promotion", icon: <CampaignIcon />, path: "/dashboard/tea/promotion" },
  // { text: "Cryptic", icon: <SmartToyIcon />, path: "/dashboard/tea/cryptic" },
  { text: "Profile", icon: <AccountCircle />, path: "/dashboard/tea/profile" },
];

export const StudentMenu = [
  { text: "Home", icon: <Dashboard />, path: "/dashboard/stu/home" },
  { text: "Class", icon: <ClassIcon />, path: "/dashboard/stu/class" },
  { text: "Batch", icon: <People />, path: "/dashboard/stu/batch" },
  { text: "Store", icon: <CampaignIcon />, path: "/dashboard/stu/store" },
  { text: "Profile", icon: <AccountCircle />, path: "/dashboard/stu/profile" },
]