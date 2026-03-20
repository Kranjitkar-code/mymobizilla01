import {
    LayoutDashboard,
    Settings,
    ShoppingCart,
    Package,
    Wrench,
    Users,
    FileText,
    Shield,
    Briefcase,
    Tag,
    Layers,
    Box,
    Cpu,
    Grid,
    List,
    MessageSquare,
    Video,
    HelpCircle,
    Palette,
    Zap,
    UserCog,
    Smartphone,
    Globe
} from 'lucide-react';

export type SidebarItem = {
    title: string;
    url: string;
    icon?: any;
    badge?: string;
    items?: SidebarItem[];
};

export type SidebarGroup = {
    title: string;
    items: SidebarItem[];
};

export const sidebarConfig: SidebarGroup[] = [
    {
        title: "",
        items: [
            {
                title: "Dashboard",
                url: "/admin/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "Website Content",
                url: "/admin/website-content",
                icon: Globe,
            },
        ],
    },
    {
        title: "Settings",
        items: [
            {
                title: "Faq",
                url: "/admin/settings/faq",
                icon: HelpCircle,
            },
            {
                title: "Repair",
                url: "/admin/settings/repair",
                icon: Wrench,
            },
            {
                title: "Banners Settings",
                url: "/admin/settings/banners",
                icon: Settings,
            },
            {
                title: "Colors",
                url: "/admin/settings/colors",
                icon: Palette,
            },
            {
                title: "Powered By",
                url: "/admin/settings/powered-by",
                icon: Zap,
            },
            {
                title: "Services",
                url: "/admin/settings/services",
                icon: Briefcase,
            },
            {
                title: "Team Members",
                url: "/admin/settings/team",
                icon: Users,
            },
            {
                title: "Testimonials",
                url: "/admin/settings/testimonials",
                icon: MessageSquare,
            },
            {
                title: "Why Choose Us",
                url: "/admin/settings/why-choose-us",
                icon: HelpCircle,
            },
            {
                title: "Our Video Lists",
                url: "/admin/settings/videos",
                icon: Video,
            },
        ],
    },
    {
        title: "Ecommerce",
        items: [
            {
                title: "Accessory Brands",
                url: "/admin/ecommerce/accessory-brands",
                icon: Tag,
            },
            {
                title: "Accessory Categories",
                url: "/admin/ecommerce/accessory-categories",
                icon: Layers,
            },
            {
                title: "Accessories",
                url: "/admin/ecommerce/accessories",
                icon: Package,
            },
            {
                title: "Accessory Sub Categories",
                url: "/admin/ecommerce/accessory-sub-categories",
                icon: Layers,
            },
            {
                title: "Brands",
                url: "/admin/ecommerce/brands",
                icon: Tag,
            },
            {
                title: "Inventories",
                url: "/admin/ecommerce/inventories",
                icon: Box,
            },
            {
                title: "Machinery Brands",
                url: "/admin/ecommerce/machinery-brands",
                icon: Tag,
            },
            {
                title: "Machinery Categories",
                url: "/admin/ecommerce/machinery-categories",
                icon: Layers,
            },
            {
                title: "Machineries",
                url: "/admin/ecommerce/machineries",
                icon: Cpu,
            },
            {
                title: "Machinery Sub Categories",
                url: "/admin/ecommerce/machinery-sub-categories",
                icon: Layers,
            },
            {
                title: "Machinery Working Natures",
                url: "/admin/ecommerce/machinery-working-natures",
                icon: Settings,
            },
            {
                title: "Models",
                url: "/admin/ecommerce/models",
                icon: Grid,
            },
            {
                title: "Orders",
                url: "/admin/ecommerce/orders",
                icon: ShoppingCart,
                badge: "0",
            },
            {
                title: "Parts Categories",
                url: "/admin/ecommerce/parts-categories",
                icon: Layers,
            },
            {
                title: "Parts",
                url: "/admin/ecommerce/parts",
                icon: Settings,
            },
            {
                title: "Secondhand Inventory",
                url: "/admin/ecommerce/secondhand-inventory",
                icon: Smartphone,
            },
            {
                title: "Skus",
                url: "/admin/ecommerce/skus",
                icon: List,
            },
        ],
    },
    {
        title: "Blog",
        items: [
            {
                title: "Blogs",
                url: "/admin/blog/blogs",
                icon: FileText,
            },
        ],
    },
    {
        title: "System Management",
        items: [
            {
                title: "Permissions",
                url: "/admin/system/permissions",
                icon: Shield,
            },
            {
                title: "Roles",
                url: "/admin/system/roles",
                icon: UserCog,
            },
            {
                title: "Users",
                url: "/admin/system/users",
                icon: Users,
            },
        ],
    },
    {
        title: "Training",
        items: [
            {
                title: "Courses",
                url: "/admin/training/courses",
                icon: Briefcase,
            },
            {
                title: "Training Videos",
                url: "/admin/training/videos",
                icon: Video,
            },
        ],
    },
];
