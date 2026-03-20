
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGES = {
    REPAIR_MAIN: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop",
    MOTHERBOARD: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    PHONE_SCREEN: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
    CHIPS: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    TOOLS: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
    IPHONE: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop",
    SECURITY: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
};

const courses = [
    {
        title: 'Basic Mobile Repair Training',
        level: 'Basic',
        short_description: 'Fundamental skills for mobile phone repair and maintenance.',
        detailed_description: 'Start your journey into mobile device repair with fundamental skills and safety protocols. This course is designed for beginners who want to build a solid foundation in smartphone repair.',
        key_learning_outcomes: [
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
        target_audience: ['Beginners', 'Students', 'Shop Owners'],
        duration: '2 Weeks (Weekend Batches)',
        price: '₨14,999',
        highlights: ['Hands-on training', 'Certificate of Completion', 'Job placement support'],
        promotional_text: 'Launch your repair career with our industry-standard basic training program!',
        image_url: IMAGES.REPAIR_MAIN,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'Medium / Intermediate Training',
        level: 'Medium',
        short_description: 'Advanced diagnostics and motherboard level repair training.',
        detailed_description: 'Take your skills to the next level with our Intermediate course. Focuses on PCB structure, advanced multimeter usage, and IC-level troubleshooting.',
        key_learning_outcomes: [
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
        target_audience: ['Technicians', 'Past Basic Course Students'],
        duration: '4 Weeks',
        price: '₨29,999',
        highlights: ['Advanced lab equipment', 'Real-world motherboards', 'IC precision work'],
        promotional_text: 'Master the intermediate level of motherboard repair.',
        image_url: IMAGES.MOTHERBOARD,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'Advanced Chip-Level Training',
        level: 'Advanced',
        short_description: 'High-end chip-level diagnostics and professional repair techniques.',
        detailed_description: 'Expert-level training covering advanced schematics, CPU/eMMC/UFS basics, and data recovery. Designed for professional technicians.',
        key_learning_outcomes: [
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
        target_audience: ['Senior Technicians', 'Business Owners'],
        duration: '6 Weeks',
        price: '₨59,999',
        highlights: ['Premium mentorship', 'Latest diagnostic tools', 'Data recovery specialist skills'],
        promotional_text: 'The ultimate qualification for the modern repair entrepreneur.',
        image_url: IMAGES.CHIPS,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'Dead Phone Specialist Training',
        level: 'Specialized',
        short_description: 'Master the techniques to revive completely dead smartphones.',
        detailed_description: 'Focused training on diagnosing and fixing dead motherboard issues across various brands.',
        key_learning_outcomes: ['Power sequence diagnostics', 'Current consumption analysis', 'PMIC troubleshooting'],
        target_audience: ['Technicians'],
        duration: '1 Week',
        price: '₨9,999',
        highlights: ['Deep diagnostics'],
        promotional_text: 'Fix what others can\'t.',
        image_url: IMAGES.MOTHERBOARD,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'Advanced Motherboard Diagnosis Course',
        level: 'Specialized',
        short_description: 'In-depth motherboard circuit analysis and fault finding.',
        detailed_description: 'Learn to use thermal cameras, oscilloscopes, and advanced multimeters to find hidden leaks.',
        key_learning_outcomes: ['Circuit tracing', 'Thermal analysis', 'Voltage injection'],
        target_audience: ['Advanced Technicians'],
        duration: '1 Week',
        price: '₨12,499',
        highlights: ['Advanced tools'],
        promotional_text: 'See the invisible shorts.',
        image_url: IMAGES.CHIPS,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'IC Reballing & BGA Specialist Course',
        level: 'Specialized',
        short_description: 'Precision soldering for BGA chips and IC components.',
        detailed_description: 'Perfect your stencil usage and heat management for safe IC removal and re-installation.',
        key_learning_outcomes: ['Reballing techniques', 'Heat profile management', 'Stencil types'],
        target_audience: ['Technicians'],
        duration: '5 Days',
        price: '₨7,999',
        highlights: ['Hands-on IC work'],
        promotional_text: 'Precise IC work for professional results.',
        image_url: IMAGES.REPAIR_MAIN,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'Android Flashing & Software Repair Course',
        level: 'Specialized',
        short_description: 'Fix all Android software issues and firmware problems.',
        detailed_description: 'Master various flashing boxes and software tools to handle bootloops, bricked devices, and updates.',
        key_learning_outcomes: ['Firmware download', 'Flashing tool usage', 'Error code handling'],
        target_audience: ['Software technicians'],
        duration: '1 Week',
        price: '₨8,999',
        highlights: ['Software mastery'],
        promotional_text: 'Unbrick any Android phone.',
        image_url: IMAGES.PHONE_SCREEN,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'FRP & Unlocking Specialist Training',
        level: 'Specialized',
        short_description: 'Secure bypass and unlocking techniques for all brands.',
        detailed_description: 'Learn legitimate methods to bypass FRP and network locks on modern devices.',
        key_learning_outcomes: ['FRP bypass', 'Network unlocking', 'IMEI basics'],
        target_audience: ['Shop owners'],
        duration: '4 Days',
        price: '₨6,999',
        highlights: ['Latest tools'],
        promotional_text: 'Unlock more revenue.',
        image_url: IMAGES.SECURITY,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'iPhone Repair & Diagnostics Course',
        level: 'Specialized',
        short_description: 'Exclusive training for iOS device hardware and software.',
        detailed_description: 'Learn the unique architecture of Apple devices, FaceID repair, and error code troubleshooting.',
        key_learning_outcomes: ['FaceID diagnostics', 'iPhone power rails', 'Panic log reading'],
        target_audience: ['Professional Technicians'],
        duration: '2 Weeks',
        price: '₨19,999',
        highlights: ['Apple specific'],
        promotional_text: 'Master the world of iPhone repair.',
        image_url: IMAGES.IPHONE,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'Android Advanced Troubleshooting Course',
        level: 'Specialized',
        short_description: 'Logic-driven fault finding for complex Android issues.',
        detailed_description: 'Systematic approach to finding intermittent faults, heating issues, and sensor problems.',
        key_learning_outcomes: ['Logic-based testing', 'Sensor troubleshooting', 'Current leakage'],
        target_audience: ['Technicians'],
        duration: '1 Week',
        price: '₨9,499',
        highlights: ['Logic training'],
        promotional_text: 'Think like a diagnostic pro.',
        image_url: IMAGES.REPAIR_MAIN,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'Water Damage Repair Specialist Training',
        level: 'Specialized',
        short_description: 'Reviving liquid damaged electronics through chemistry and skill.',
        detailed_description: 'Learn professional cleaning, ultrasonic therapy, and corrosion removal techniques.',
        key_learning_outcomes: ['Corrosion cleanup', 'Short clearing', 'Cleaning chemicals'],
        target_audience: ['Technicians'],
        duration: '3 Days',
        price: '₨4,999',
        highlights: ['Chemical safety'],
        promotional_text: 'Save the unsavable.',
        image_url: IMAGES.MOTHERBOARD,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'Charging & Power Section Repair Course',
        level: 'Specialized',
        short_description: 'Focus on PMICs, charging ICs, and USB circuits.',
        detailed_description: 'Master the power management of smartphones, from battery connectors to main PMUs.',
        key_learning_outcomes: ['Charging protocols', 'VBUS/VBAT tracing', 'PMU signals'],
        target_audience: ['Technicians'],
        duration: '1 Week',
        price: '₨8,499',
        highlights: ['Power specialist'],
        promotional_text: 'Charge ahead in your career.',
        image_url: IMAGES.CHIPS,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'Network & Signal Repair Masterclass',
        level: 'Specialized',
        short_description: 'Fix 4G/5G signal drops and Wi-Fi/Bluetooth issues.',
        detailed_description: 'Understand RF circuits, antenna matching, and transceiver replacement.',
        key_learning_outcomes: ['RF circuit analysis', 'Antenna diagnostics', 'Baseband repair'],
        target_audience: ['Advanced Technicians'],
        duration: '1 Week',
        price: '₨10,999',
        highlights: ['RF expertise'],
        promotional_text: 'Stay connected with professional skills.',
        image_url: IMAGES.TOOLS,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'Professional Flash Tool Mastery Program',
        level: 'Specialized',
        short_description: 'Expert usage of hardware-based software tools.',
        detailed_description: 'Master UFI Box, Z3X, Medusa, and other professional equipment for hardware software integration.',
        key_learning_outcomes: ['Box installation', 'ISP pinouts', 'Direct eMMC work'],
        target_audience: ['Advanced Software Techs'],
        duration: '1 Week',
        price: '₨14,499',
        highlights: ['ISP pinout mastery'],
        promotional_text: 'High-end software hardware tools.',
        image_url: IMAGES.CHIPS,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    },
    {
        title: 'Data Recovery & Security Basics Course',
        level: 'Specialized',
        short_description: 'Retrieving data from damaged phones and basic cybersecurity.',
        detailed_description: 'Understand NAND health, file systems, and safe data extraction from broken devices.',
        key_learning_outcomes: ['NAND reading', 'File system repairs', 'Safe extraction'],
        target_audience: ['Technicians', 'Investigators'],
        duration: '5 Days',
        price: '₨15,999',
        highlights: ['Critical skill'],
        promotional_text: 'Recover hope for your customers.',
        image_url: IMAGES.SECURITY,
        google_form_url: 'https://docs.google.com/forms/d/e/1FAIpQLSfK0HZxuZt2xF-_ZCnF44YHZHIkScls7Aq24WYieaRXMV_NUg/viewform?usp=dialog'
    }
];

async function seed() {
    console.log('Clearing existing courses...');
    const { error: deleteError } = await supabase
        .from('training_courses')
        .delete()
        .neq('title', 'placeholder_force_delete_all');

    if (deleteError) {
        console.error('Error clearing table:', deleteError);
        return;
    }

    console.log('Inserting 15 courses...');
    const { data, error } = await supabase
        .from('training_courses')
        .insert(courses)
        .select();

    if (error) {
        console.error('Error seeding courses:');
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log(`Successfully seeded ${data.length} courses!`);
    }
}

seed();
