
export interface Course {
    id: string;
    title: string;
    level: 'Basic' | 'Medium' | 'Advanced' | 'Specialized';
    shortDescription: string;
    detailedDescription: string;
    keyLearningOutcomes: string[];
    targetAudience: string[];
    duration: string;
    price: string;
    highlights: string[];
    promotionalText: string;
    imageUrl: string;
    googleFormUrl: string;
}

// Reliable Tech/Repair Images
const IMAGES = {
    REPAIR_MAIN: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop",
    MOTHERBOARD: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    PHONE_SCREEN: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
    CHIPS: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    TOOLS: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
    IPHONE: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop",
    SECURITY: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
};

export const courses: Course[] = [
    {
        id: 'basic-mobile-repair',
        title: 'Basic Mobile Repair Training',
        level: 'Basic',
        shortDescription: 'Fundamental skills for mobile phone repair and maintenance.',
        detailedDescription: 'Start your journey into mobile device repair with fundamental skills and safety protocols. This course is designed for beginners who want to build a solid foundation in smartphone repair.',
        keyLearningOutcomes: [
            'Mobile phone disassembly & safe handling',
            'LCD / OLED screen replacement',
            'Battery & charging port replacement',
            'Speaker, mic & camera replacement',
            'Basic soldering practice',
            'Multimeter introduction',
            'Water damage basic treatment',
            'Software flashing & FRP reset',
            'Common troubleshooting techniques'
        ],
        targetAudience: ['Beginners', 'Students', 'Shop Owners'],
        duration: '2 Weeks (Weekend Batches)',
        price: '₨14,999',
        highlights: ['Hands-on training', 'Certificate of Completion', 'Job placement support'],
        promotionalText: 'Launch your repair career with our industry-standard basic training program!',
        imageUrl: IMAGES.REPAIR_MAIN,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'medium-intermediate-training',
        title: 'Medium / Intermediate Training',
        level: 'Medium',
        shortDescription: 'Advanced diagnostics and motherboard level repair training.',
        detailedDescription: 'Take your skills to the next level with our Intermediate course. Focuses on PCB structure, advanced multimeter usage, and IC-level troubleshooting.',
        keyLearningOutcomes: [
            'PCB & motherboard structure understanding',
            'Advanced multimeter usage',
            'Short detection techniques',
            'IC identification & replacement',
            'Jumper wire & pad repair',
            'Network & signal troubleshooting',
            'Charging IC problems',
            'Auto restart & dead boot issues',
            'Practical board-level repair training'
        ],
        targetAudience: ['Technicians', 'Past Basic Course Students'],
        duration: '4 Weeks',
        price: '₨29,999',
        highlights: ['Advanced lab equipment', 'Real-world motherboards', 'IC precision work'],
        promotionalText: 'Master the intermediate level of motherboard repair.',
        imageUrl: IMAGES.MOTHERBOARD,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'advanced-chip-level-training',
        title: 'Advanced Chip-Level Training',
        level: 'Advanced',
        shortDescription: 'High-end chip-level diagnostics and professional repair techniques.',
        detailedDescription: 'Expert-level training covering advanced schematics, CPU/eMMC/UFS basics, and data recovery. Designed for professional technicians.',
        keyLearningOutcomes: [
            'Advanced schematic & boardview reading',
            'Power sequence analysis',
            'Dead short diagnosis',
            'CPU / eMMC / UFS basics',
            'IC reballing techniques',
            'PMIC replacement',
            'Professional flashing tools use',
            'Data recovery basics',
            'Complete dead phone repair'
        ],
        targetAudience: ['Senior Technicians', 'Business Owners'],
        duration: '6 Weeks',
        price: '₨59,999',
        highlights: ['Premium mentorship', 'Latest diagnostic tools', 'Data recovery specialist skills'],
        promotionalText: 'The ultimate qualification for the modern repair entrepreneur.',
        imageUrl: IMAGES.CHIPS,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'dead-phone-specialist',
        title: 'Dead Phone Specialist Training',
        level: 'Specialized',
        shortDescription: 'Master the techniques to revive completely dead smartphones.',
        detailedDescription: 'Focused training on diagnosing and fixing dead motherboard issues across various brands.',
        keyLearningOutcomes: ['Power sequence diagnostics', 'Current consumption analysis', 'PMIC troubleshooting'],
        targetAudience: ['Technicians'],
        duration: '1 Week',
        price: '₨9,999',
        highlights: ['Deep diagnostics'],
        promotionalText: 'Fix what others can\'t.',
        imageUrl: IMAGES.MOTHERBOARD,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'advanced-motherboard-diagnosis',
        title: 'Advanced Motherboard Diagnosis Course',
        level: 'Specialized',
        shortDescription: 'In-depth motherboard circuit analysis and fault finding.',
        detailedDescription: 'Learn to use thermal cameras, oscilloscopes, and advanced multimeters to find hidden leaks.',
        keyLearningOutcomes: ['Circuit tracing', 'Thermal analysis', 'Voltage injection'],
        targetAudience: ['Advanced Technicians'],
        duration: '1 Week',
        price: '₨12,499',
        highlights: ['Advanced tools'],
        promotionalText: 'See the invisible shorts.',
        imageUrl: IMAGES.CHIPS,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'ic-reballing-bga-specialist',
        title: 'IC Reballing & BGA Specialist Course',
        level: 'Specialized',
        shortDescription: 'Precision soldering for BGA chips and IC components.',
        detailedDescription: 'Perfect your stencil usage and heat management for safe IC removal and re-installation.',
        keyLearningOutcomes: ['Reballing techniques', 'Heat profile management', 'Stencil types'],
        targetAudience: ['Technicians'],
        duration: '5 Days',
        price: '₨7,999',
        highlights: ['Hands-on IC work'],
        promotionalText: 'Precise IC work for professional results.',
        imageUrl: IMAGES.REPAIR_MAIN,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'android-flashing-software-repair',
        title: 'Android Flashing & Software Repair Course',
        level: 'Specialized',
        shortDescription: 'Fix all Android software issues and firmware problems.',
        detailedDescription: 'Master various flashing boxes and software tools to handle bootloops, bricked devices, and updates.',
        keyLearningOutcomes: ['Firmware download', 'Flashing tool usage', 'Error code handling'],
        targetAudience: ['Software technicians'],
        duration: '1 Week',
        price: '₨8,999',
        highlights: ['Software mastery'],
        promotionalText: 'Unbrick any Android phone.',
        imageUrl: IMAGES.PHONE_SCREEN,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'frp-unlocking-specialist',
        title: 'FRP & Unlocking Specialist Training',
        level: 'Specialized',
        shortDescription: 'Secure bypass and unlocking techniques for all brands.',
        detailedDescription: 'Learn legitimate methods to bypass FRP and network locks on modern devices.',
        keyLearningOutcomes: ['FRP bypass', 'Network unlocking', 'IMEI basics'],
        targetAudience: ['Shop owners'],
        duration: '4 Days',
        price: '₨6,999',
        highlights: ['Latest tools'],
        promotionalText: 'Unlock more revenue.',
        imageUrl: IMAGES.SECURITY,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'iphone-repair-diagnostics',
        title: 'iPhone Repair & Diagnostics Course',
        level: 'Specialized',
        shortDescription: 'Exclusive training for iOS device hardware and software.',
        detailedDescription: 'Learn the unique architecture of Apple devices, FaceID repair, and error code troubleshooting.',
        keyLearningOutcomes: ['FaceID diagnostics', 'iPhone power rails', 'Panic log reading'],
        targetAudience: ['Professional Technicians'],
        duration: '2 Weeks',
        price: '₨19,999',
        highlights: ['Apple specific'],
        promotionalText: 'Master the world of iPhone repair.',
        imageUrl: IMAGES.IPHONE,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'android-advanced-troubleshooting',
        title: 'Android Advanced Troubleshooting Course',
        level: 'Specialized',
        shortDescription: 'Logic-driven fault finding for complex Android issues.',
        detailedDescription: 'Systematic approach to finding intermittent faults, heating issues, and sensor problems.',
        keyLearningOutcomes: ['Logic-based testing', 'Sensor troubleshooting', 'Current leakage'],
        targetAudience: ['Technicians'],
        duration: '1 Week',
        price: '₨9,499',
        highlights: ['Logic training'],
        promotionalText: 'Think like a diagnostic pro.',
        imageUrl: IMAGES.REPAIR_MAIN,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'water-damage-repair-specialist',
        title: 'Water Damage Repair Specialist Training',
        level: 'Specialized',
        shortDescription: 'Reviving liquid damaged electronics through chemistry and skill.',
        detailedDescription: 'Learn professional cleaning, ultrasonic therapy, and corrosion removal techniques.',
        keyLearningOutcomes: ['Corrosion cleanup', 'Short clearing', 'Cleaning chemicals'],
        targetAudience: ['Technicians'],
        duration: '3 Days',
        price: '₨4,999',
        highlights: ['Chemical safety'],
        promotionalText: 'Save the unsavable.',
        imageUrl: IMAGES.MOTHERBOARD,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'charging-power-section-repair',
        title: 'Charging & Power Section Repair Course',
        level: 'Specialized',
        shortDescription: 'Focus on PMICs, charging ICs, and USB circuits.',
        detailedDescription: 'Master the power management of smartphones, from battery connectors to main PMUs.',
        keyLearningOutcomes: ['Charging protocols', 'VBUS/VBAT tracing', 'PMU signals'],
        targetAudience: ['Technicians'],
        duration: '1 Week',
        price: '₨8,499',
        highlights: ['Power specialist'],
        promotionalText: 'Charge ahead in your career.',
        imageUrl: IMAGES.CHIPS,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'network-signal-repair-masterclass',
        title: 'Network & Signal Repair Masterclass',
        level: 'Specialized',
        shortDescription: 'Fix 4G/5G signal drops and Wi-Fi/Bluetooth issues.',
        detailedDescription: 'Understand RF circuits, antenna matching, and transceiver replacement.',
        keyLearningOutcomes: ['RF circuit analysis', 'Antenna diagnostics', 'Baseband repair'],
        targetAudience: ['Advanced Technicians'],
        duration: '1 Week',
        price: '₨10,999',
        highlights: ['RF expertise'],
        promotionalText: 'Stay connected with professional skills.',
        imageUrl: IMAGES.TOOLS,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'professional-flash-tool-mastery',
        title: 'Professional Flash Tool Mastery Program',
        level: 'Specialized',
        shortDescription: 'Expert usage of hardware-based software tools.',
        detailedDescription: 'Master UFI Box, Z3X, Medusa, and other professional equipment for hardware software integration.',
        keyLearningOutcomes: ['Box installation', 'ISP pinouts', 'Direct eMMC work'],
        targetAudience: ['Advanced Software Techs'],
        duration: '1 Week',
        price: '₨14,499',
        highlights: ['ISP pinout mastery'],
        promotionalText: 'High-end software hardware tools.',
        imageUrl: IMAGES.CHIPS,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        id: 'data-recovery-security-basics',
        title: 'Data Recovery & Security Basics Course',
        level: 'Specialized',
        shortDescription: 'Retrieving data from damaged phones and basic cybersecurity.',
        detailedDescription: 'Understand NAND health, file systems, and safe data extraction from broken devices.',
        keyLearningOutcomes: ['NAND reading', 'File system repairs', 'Safe extraction'],
        targetAudience: ['Technicians', 'Investigators'],
        duration: '5 Days',
        price: '₨15,999',
        highlights: ['Critical skill'],
        promotionalText: 'Recover hope for your customers.',
        imageUrl: IMAGES.SECURITY,
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    }
];
