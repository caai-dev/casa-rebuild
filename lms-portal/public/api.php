<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Locate persistent data directory outside the web root (survives Git redeployments on Hostinger)
$dataDir = __DIR__ . '/../casa_data';

// Fallback to local web folder if parent directory is not writable (for local dev)
if (!is_writable(dirname(__DIR__)) && !file_exists($dataDir)) {
    $dataDir = __DIR__ . '/data';
}

if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$librariesFile = $dataDir . '/libraries.json';
$progressFile = $dataDir . '/progress.json';

// Auto-generate default .env on the server if it doesn't exist in the persistent dir
$envFile = $dataDir . '/.env';
if (!file_exists($envFile)) {
    file_put_contents($envFile, "VITE_SUPER_ADMIN_KEY=CASA57\nVITE_COMMON_ACCESS_KEY=443357\n");
}

// Load keys from server-side .env file
$adminKey = 'CASA57';
$commonKey = '443357';
$envContent = file_get_contents($envFile);
if (preg_match('/VITE_SUPER_ADMIN_KEY\s*=\s*(.*)/', $envContent, $matches)) {
    $adminKey = trim($matches[1]);
}
if (preg_match('/VITE_COMMON_ACCESS_KEY\s*=\s*(.*)/', $envContent, $matches)) {
    $commonKey = trim($matches[1]);
}

// Default libraries fallback
$defaultLibraries = [
  [
    "id" => "excel",
    "name" => "Excel",
    "description" => "Advanced Excel formulas, formatting guidelines, dynamic modeling, and financial templates.",
    "resources" => [
      [
        "id" => "excel-v1",
        "type" => "video",
        "youtubeId" => "yK7nC1E8u4g",
        "title" => "Excel Formulas & Financial Modeling Walkthrough",
        "category" => "Excel Basics",
        "duration" => "14:22",
        "description" => "Learn key financial formulas, formatting standards, and modeling methodologies for client file reviews."
      ],
      [
        "id" => "excel-d1",
        "type" => "doc",
        "name" => "Staff Travel & Expense Reimbursement Sheet",
        "format" => "Excel (XLSX)",
        "size" => "1.2 MB",
        "date" => "Mar 10, 2026"
      ]
    ]
  ],
  [
    "id" => "ai",
    "name" => "AI",
    "description" => "AI tools guidelines, accounting prompts, and compliance standards for AI automation.",
    "resources" => []
  ],
  [
    "id" => "formattings",
    "name" => "Formattings",
    "description" => "Standard layout templates, font styling, and report structure guidelines for Word and Excel.",
    "resources" => []
  ],
  [
    "id" => "income-tax",
    "name" => "Income Tax",
    "description" => "Tax return scheduling, compliance guidances, and corporate client advisory reviews.",
    "resources" => [
      [
        "id" => "tax-v1",
        "type" => "video",
        "youtubeId" => "P_o22QzO1qg",
        "title" => "Corporate Tax Schedules & Compliance Guidance",
        "category" => "Tax & Legal",
        "duration" => "18:45",
        "description" => "A walkthrough of filing procedures, local compliance schedules, and advisory templates for corporate enterprise reviews."
      ],
      [
        "id" => "tax-d1",
        "type" => "doc",
        "name" => "Corporate Compliance Calendar Q3-Q4",
        "format" => "PDF Document",
        "size" => "1.8 MB",
        "date" => "May 25, 2026"
      ]
    ]
  ],
  [
    "id" => "gst",
    "name" => "GST",
    "description" => "GST invoice verification, audit standards, tax reconciliation, and ledger templates.",
    "resources" => []
  ],
  [
    "id" => "accounting",
    "name" => "Accounting",
    "description" => "Core double-entry accounting tutorials, staff invoicing templates, and balance sheet calculators.",
    "resources" => []
  ],
  [
    "id" => "audit",
    "name" => "Audit",
    "description" => "Auditing standards, client information security, and working paper checksheets.",
    "resources" => [
      [
        "id" => "audit-v1",
        "type" => "video",
        "youtubeId" => "z1S_Cy9zdjQ",
        "title" => "Client Information Security & GDPR Compliance",
        "category" => "Security",
        "duration" => "10:15",
        "description" => "Protocols for managing confidential client database access, cloud vault security compliance, and staff encryption guidelines."
      ],
      [
        "id" => "audit-v2",
        "type" => "video",
        "youtubeId" => "yK7nC1E8u4g", // Audit standards walkthrough
        "title" => "CASA Auditing Standards & Checklist Walkthrough",
        "category" => "Audit & Assurance",
        "duration" => "14:22",
        "description" => "Detailed internal training detailing the compliance checklists, field audit standards, and working paper templates required for Q3 client audits."
      ],
      [
        "id" => "audit-d1",
        "type" => "doc",
        "name" => "CASA Audit Audit Working Papers Template",
        "format" => "Word (DOCX)",
        "size" => "2.4 MB",
        "date" => "Jan 12, 2026"
      ],
      [
        "id" => "audit-d2",
        "type" => "doc",
        "name" => "Client Onboarding & Intake Checklist",
        "format" => "PDF Document",
        "size" => "850 KB",
        "date" => "Jun 02, 2026"
      ]
    ]
  ],
  [
    "id" => "softwares",
    "name" => "Softwares",
    "description" => "Tutorials and files for QuickBooks Online, Xero, and corporate CRM platforms.",
    "resources" => [
      [
        "id" => "soft-v1",
        "type" => "video",
        "youtubeId" => "9g2967_4kqc",
        "title" => "Intranet CRM Systems & Timesheet Submission Guides",
        "category" => "Systems",
        "duration" => "08:30",
        "description" => "Training guide for our internal CRM, client record updates, and submitting weekly project hours via the staff portal."
      ]
    ]
  ]
];

// Initialize database files on first load
if (!file_exists($librariesFile)) {
    file_put_contents($librariesFile, json_encode($defaultLibraries, JSON_PRETTY_PRINT));
}
if (!file_exists($progressFile)) {
    file_put_contents($progressFile, json_encode([], JSON_PRETTY_PRINT));
}

// 1. GET Operation (Load Database)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $libs = json_decode(file_get_contents($librariesFile), true);
    echo json_encode([
        "libraries" => $libs
    ]);
    exit;
}

// 2. POST Operations (CRUD & Auth)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    
    if (!$input || !isset($input['action'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid request parameters"]);
        exit;
    }
    
    $action = $input['action'];
    
    // Server-side login verification
    if ($action === 'login') {
        if (!isset($input['username']) || !isset($input['access_key'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing username or access key"]);
            exit;
        }
        $username = trim($input['username']);
        $accessKey = trim($input['access_key']);
        
        $isAdminUser = (
            strcasecmp($username, 'sagar') === 0 || 
            strcasecmp($username, 'dev') === 0 || 
            strcasecmp($username, 'admin') === 0
        );
        
        if ($isAdminUser && $accessKey === $adminKey) {
            echo json_encode(["success" => true, "role" => "admin"]);
            exit;
        }
        
        // Standard user checks
        if (preg_match('/^CASA\d+$/i', $username) && $accessKey === $commonKey) {
            $progress = json_decode(file_get_contents($progressFile), true);
            $userProgress = isset($progress[$username]) ? $progress[$username] : [
                "completed_videos" => [],
                "last_active" => date('Y-m-d\TH:i:s\Z')
            ];
            echo json_encode([
                "success" => true, 
                "role" => "member",
                "progress" => $userProgress
            ]);
            exit;
        }
        
        echo json_encode(["success" => false, "error" => "Invalid Username or Access Key"]);
        exit;
    }
    
    // Fetch individual progress (Standard Users)
    if ($action === 'get_progress') {
        if (!isset($input['username'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing username"]);
            exit;
        }
        $username = trim($input['username']);
        $progress = json_decode(file_get_contents($progressFile), true);
        
        $userProgress = isset($progress[$username]) ? $progress[$username] : [
            "completed_videos" => [],
            "last_active" => ""
        ];
        echo json_encode(["success" => true, "progress" => $userProgress]);
        exit;
    }
    
    // Save progress updates (Standard Users)
    if ($action === 'save_progress') {
        if (!isset($input['username']) || !isset($input['completed_videos'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing username or progress data"]);
            exit;
        }
        $username = trim($input['username']);
        $completed = $input['completed_videos'];
        
        $progress = json_decode(file_get_contents($progressFile), true);
        $progress[$username] = [
            "completed_videos" => $completed,
            "last_active" => date('Y-m-d\TH:i:s\Z')
        ];
        
        file_put_contents($progressFile, json_encode($progress, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "progress" => $progress[$username]]);
        exit;
    }
    
    // ----------------------------------------------------
    // ADMIN ACTIONS (Require admin_key verification)
    // ----------------------------------------------------
    if (!isset($input['admin_key'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing admin verification key"]);
        exit;
    }
    
    if ($input['admin_key'] !== $adminKey) {
        http_response_code(403);
        echo json_encode(["error" => "Unauthorized access key"]);
        exit;
    }
    
    // Get entire users list tracking log (Admin only)
    if ($action === 'get_users_progress') {
        $progress = json_decode(file_get_contents($progressFile), true);
        echo json_encode(["success" => true, "progress" => $progress]);
        exit;
    }
    
    // Save Library (Add or Edit)
    if ($action === 'save_library') {
        if (!isset($input['library'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing library data"]);
            exit;
        }
        $newLib = $input['library'];
        $libs = json_decode(file_get_contents($librariesFile), true);
        
        $found = false;
        foreach ($libs as &$l) {
            if ($l['id'] === $newLib['id']) {
                $l['name'] = $newLib['name'];
                $l['description'] = $newLib['description'];
                $found = true;
                break;
            }
        }
        if (!$found) {
            $newLib['resources'] = [];
            $libs[] = $newLib;
        }
        
        file_put_contents($librariesFile, json_encode($libs, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "libraries" => $libs]);
        exit;
    }
    
    // Delete Library
    if ($action === 'delete_library') {
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing library ID"]);
            exit;
        }
        $id = $input['id'];
        $libs = json_decode(file_get_contents($librariesFile), true);
        
        $filtered = array_filter($libs, function($l) use ($id) {
            return $l['id'] !== $id;
        });
        $filtered = array_values($filtered);
        
        file_put_contents($librariesFile, json_encode($filtered, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "libraries" => $filtered]);
        exit;
    }
    
    // Save Resource (Video, Doc, or Link)
    if ($action === 'save_resource') {
        if (!isset($input['library_id']) || !isset($input['resource'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing library ID or resource data"]);
            exit;
        }
        $libId = $input['library_id'];
        $newRes = $input['resource'];
        $libs = json_decode(file_get_contents($librariesFile), true);
        
        $libFound = false;
        foreach ($libs as &$l) {
            if ($l['id'] === $libId) {
                $libFound = true;
                if (!isset($l['resources'])) {
                    $l['resources'] = [];
                }
                
                $resFound = false;
                foreach ($l['resources'] as &$r) {
                    if ($r['id'] === $newRes['id']) {
                        $r = $newRes;
                        $resFound = true;
                        break;
                    }
                }
                if (!$resFound) {
                    $l['resources'][] = $newRes;
                }
                break;
            }
        }
        
        if (!$libFound) {
            http_response_code(404);
            echo json_encode(["error" => "Library not found"]);
            exit;
        }
        
        file_put_contents($librariesFile, json_encode($libs, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "libraries" => $libs]);
        exit;
    }
    
    // Delete Resource
    if ($action === 'delete_resource') {
        if (!isset($input['library_id']) || !isset($input['resource_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing library ID or resource ID"]);
            exit;
        }
        $libId = $input['library_id'];
        $resId = $input['resource_id'];
        $libs = json_decode(file_get_contents($librariesFile), true);
        
        $libFound = false;
        foreach ($libs as &$l) {
            if ($l['id'] === $libId) {
                $libFound = true;
                if (isset($l['resources'])) {
                    $filtered = array_filter($l['resources'], function($r) use ($resId) {
                        return $r['id'] !== $resId;
                    });
                    $l['resources'] = array_values($filtered);
                }
                break;
            }
        }
        
        if (!$libFound) {
            http_response_code(404);
            echo json_encode(["error" => "Library not found"]);
            exit;
        }
        
        file_put_contents($librariesFile, json_encode($libs, JSON_PRETTY_PRINT));
        echo json_encode(["success" => true, "libraries" => $libs]);
        exit;
    }
    
    http_response_code(400);
    echo json_encode(["error" => "Unknown action"]);
    exit;
}
?>
