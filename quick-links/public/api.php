<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Data Directory outside the web root (relative to dist/api.php)
$possiblePaths = [
    __DIR__ . '/../casa_data',
    __DIR__ . '/../../casa_data',
    __DIR__ . '/../../../casa_data',
    __DIR__ . '/casa_data'
];

$dataDir = null;
// 1. Prioritize path where database already exists (migrates old data instantly!)
foreach ($possiblePaths as $path) {
    if (file_exists($path . '/quick_links.json')) {
        $dataDir = $path;
        break;
    }
}

// 2. Fallback to existing directory
if (!$dataDir) {
    foreach ($possiblePaths as $path) {
        if (file_exists($path) && is_dir($path)) {
            $dataDir = $path;
            break;
        }
    }
}

// 3. Fallback to first writable path
if (!$dataDir) {
    foreach ($possiblePaths as $path) {
        $parent = dirname($path);
        if (is_writable($parent)) {
            $dataDir = $path;
            break;
        }
    }
}

// 4. Default fallback
if (!$dataDir) {
    $dataDir = __DIR__ . '/data';
}

if (!file_exists($dataDir)) {
    mkdir($dataDir, 0777, true);
}
$LINKS_FILE = $dataDir . '/quick_links.json';

// Default categories and links if database doesn't exist
$DEFAULT_CATEGORIES = [
    [
        "id" => "taxation",
        "title" => "Taxation Portals",
        "icon" => "Receipt",
        "color" => "text-rose-500 bg-rose-500/10 border-rose-500/20",
        "links" => [
            [ "id" => "tax-1", "name" => "Income Tax Login", "desc" => "Income tax e-filing portal for filing returns and tax audits.", "url" => "https://www.incometax.gov.in/" ],
            [ "id" => "tax-2", "name" => "Income Tax Sections", "desc" => "Reference database for sections, rules, and circulars.", "url" => "https://www.incometaxindia.gov.in/" ],
            [ "id" => "tax-3", "name" => "E-Pay Challan", "desc" => "Online portal for payment of direct taxes (Challan 280/281).", "url" => "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/epay-tax-prelogin" ],
            [ "id" => "tax-4", "name" => "Traces", "desc" => "TDS reconciliation, correction, and Form 16/26AS services.", "url" => "https://www.tdscpc.gov.in/" ],
            [ "id" => "tax-5", "name" => "GST Search", "desc" => "Verify tax identity and filing records of any GSTIN.", "url" => "https://www.gst.gov.in/" ],
            [ "id" => "tax-6", "name" => "GST Portal", "desc" => "Online filing of GST returns, payments, and registration.", "url" => "https://www.gst.gov.in/" ]
        ]
    ],
    [
        "id" => "corporate",
        "title" => "Corporate & Licensing",
        "icon" => "Building",
        "color" => "text-sky-500 bg-sky-500/10 border-sky-500/20",
        "links" => [
            [ "id" => "corp-1", "name" => "MCA21", "desc" => "Ministry of Corporate Affairs corporate compliance portal.", "url" => "https://www.mca.gov.in/" ],
            [ "id" => "corp-2", "name" => "Trademark Registry", "desc" => "IP India portal for trademark filing and name availability search.", "url" => "https://ipindiaonline.gov.in/" ],
            [ "id" => "corp-3", "name" => "MSME Registration", "desc" => "Udyam registration for micro, small, and medium businesses.", "url" => "https://udyamregistration.gov.in/" ],
            [ "id" => "corp-4", "name" => "FSSAI License", "desc" => "Food Safety and Standards Authority food licensing portal.", "url" => "https://foscos.fssai.gov.in/" ],
            [ "id" => "corp-5", "name" => "Cibil Portal", "desc" => "Credit Information Bureau checking credit reports.", "url" => "https://www.cibil.com/" ]
        ]
    ],
    [
        "id" => "labor",
        "title" => "Labor Compliance",
        "icon" => "Users",
        "color" => "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        "links" => [
            [ "id" => "lab-1", "name" => "Employee EPFO", "desc" => "Provident fund portal for checking balance & pension claims.", "url" => "https://www.epfindia.gov.in/" ],
            [ "id" => "lab-2", "name" => "Employer EPFO", "desc" => "PF deposit, return filing, and compliance management.", "url" => "https://unifiedportal-emp.epfindia.gov.in/" ],
            [ "id" => "lab-3", "name" => "ESIC Portal", "desc" => "Employees State Insurance registration and filings.", "url" => "https://www.esic.gov.in/" ]
        ]
    ],
    [
        "id" => "utilities",
        "title" => "Business Utilities",
        "icon" => "Globe",
        "color" => "text-amber-500 bg-amber-500/10 border-amber-500/20",
        "links" => [
            [ "id" => "util-1", "name" => "Currency Convertor", "desc" => "Real-time foreign currency exchange rates converter.", "url" => "https://www.xe.com/currencyconverter/" ]
        ]
    ]
];

// Load Database
function loadLinks($filePath, $defaults) {
    if (!file_exists($filePath)) {
        file_put_contents($filePath, json_encode($defaults, JSON_PRETTY_PRINT));
        return $defaults;
    }
    $raw = file_get_contents($filePath);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $defaults;
}

// Save Database
function saveLinks($filePath, $data) {
    file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
}

// Handle Request
$method = $_SERVER['REQUEST_METHOD'];
$categories = loadLinks($LINKS_FILE, $DEFAULT_CATEGORIES);

if ($method === 'GET') {
    echo json_encode(["success" => true, "categories" => $categories]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        echo json_encode(["success" => false, "error" => "Invalid JSON input"]);
        exit();
    }

    $action = $input['action'] ?? '';
    $adminKey = $input['admin_key'] ?? '';

    // Auth check for state-modifying requests
    if ($adminKey !== 'CASA57') {
        echo json_encode(["success" => false, "error" => "Unauthorized access. Invalid Admin Key."]);
        exit();
    }

    switch ($action) {
        case 'save_category':
            $catId = $input['id'] ?? '';
            $title = $input['title'] ?? '';
            $icon = $input['icon'] ?? 'Globe';
            $color = $input['color'] ?? 'text-[#b8935a] bg-[#b8935a]/10 border-[#b8935a]/20';

            if (empty($title)) {
                echo json_encode(["success" => false, "error" => "Category Title cannot be empty."]);
                exit();
            }

            $found = false;
            foreach ($categories as &$cat) {
                if ($cat['id'] === $catId) {
                    $cat['title'] = $title;
                    $cat['icon'] = $icon;
                    $cat['color'] = $color;
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                // Add new category
                $newCat = [
                    "id" => uniqid('cat_'),
                    "title" => $title,
                    "icon" => $icon,
                    "color" => $color,
                    "links" => []
                ];
                $categories[] = $newCat;
            }

            saveLinks($LINKS_FILE, $categories);
            echo json_encode(["success" => true, "categories" => $categories]);
            break;

        case 'delete_category':
            $catId = $input['id'] ?? '';
            $filtered = [];
            foreach ($categories as $cat) {
                if ($cat['id'] !== $catId) {
                    $filtered[] = $cat;
                }
            }
            $categories = $filtered;
            saveLinks($LINKS_FILE, $categories);
            echo json_encode(["success" => true, "categories" => $categories]);
            break;

        case 'save_link':
            $catId = $input['category_id'] ?? '';
            $linkId = $input['id'] ?? '';
            $name = $input['name'] ?? '';
            $desc = $input['desc'] ?? '';
            $url = $input['url'] ?? '';

            if (empty($name) || empty($url)) {
                echo json_encode(["success" => false, "error" => "Link Name and URL cannot be empty."]);
                exit();
            }

            // Ensure URL starts with protocol
            if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
                $url = "https://" . $url;
            }

            $catFound = false;
            foreach ($categories as &$cat) {
                if ($cat['id'] === $catId) {
                    $catFound = true;
                    $linkFound = false;
                    foreach ($cat['links'] as &$link) {
                        if ($link['id'] === $linkId) {
                            $link['name'] = $name;
                            $link['desc'] = $desc;
                            $link['url'] = $url;
                            $linkFound = true;
                            break;
                        }
                    }
                    if (!$linkFound) {
                        $cat['links'][] = [
                            "id" => uniqid('link_'),
                            "name" => $name,
                            "desc" => $desc,
                            "url" => $url
                        ];
                    }
                    break;
                }
            }

            if (!$catFound) {
                echo json_encode(["success" => false, "error" => "Target category not found."]);
                exit();
            }

            saveLinks($LINKS_FILE, $categories);
            echo json_encode(["success" => true, "categories" => $categories]);
            break;

        case 'delete_link':
            $catId = $input['category_id'] ?? '';
            $linkId = $input['id'] ?? '';

            foreach ($categories as &$cat) {
                if ($cat['id'] === $catId) {
                    $filtered = [];
                    foreach ($cat['links'] as $link) {
                        if ($link['id'] !== $linkId) {
                            $filtered[] = $link;
                        }
                    }
                    $cat['links'] = $filtered;
                    break;
                }
            }

            saveLinks($LINKS_FILE, $categories);
            echo json_encode(["success" => true, "categories" => $categories]);
            break;

        default:
            echo json_encode(["success" => false, "error" => "Unknown action."]);
            break;
    }
    exit();
}
