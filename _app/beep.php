<?php
// Beep

$qpath = array_key_exists('path', $_REQUEST) ? $_REQUEST['path'] : '/';
$qpath = str_ireplace("\\", '/', $qpath);
$qpath = '/' . trim($qpath, '/');
if ($qpath[strlen($qpath) - 1] != '/') $qpath .= '/';
$path = dirname(__DIR__) . $qpath;

$blacklist = [
    'beep.php',
    'index.html',
    'site.css',
    'site.js',
    '_app'
];
$info = [
    'path' => '/' . trim($qpath, '/'),
    'name' => basename($qpath),
    'readme' => ''
];
$files = [];

if (is_dir($path)) {
    foreach (glob($path . '*') as $filename) {
        $basename = basename($filename);

        if (array_search($basename, $blacklist) !== false) {
            continue;
        }
        if ($basename == 'readme.md') {
            $info['readme'] = file_get_contents($filename);
            continue;
        }
        if ($basename == 'meta.json') {
            $dec = json_decode(file_get_contents($filename), true);
            foreach ($dec as $k => $v) {
                $info[$k] = $v;
            }
            continue;
        }
        if (is_dir($filename)) {
            $files[] = [
                'type' => 'directory',
                'name' => $basename,
                'path' => $qpath . $basename
            ];
        } else {
            $files[] = [
                'type' => 'file',
                'name' => $basename,
                'path' => $qpath . $basename,
                'size' => filesize($filename)
            ];
        }
    }
}

header('Content-Type: application/json');
echo json_encode([
    'info' => $info,
    'files' => $files
]);