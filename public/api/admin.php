<?php
session_start();

// Simple admin interface to view suggestions
// You should add proper authentication in production

header('Content-Type: text/html; charset=utf-8');

// Database configuration
$host = 'localhost';
$dbname = 'novasaas_osint_contact';
$username = 'novasaas_contact_db_admin';
$password = 'KontakVeryYoneticisi25%';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Handle status updates
    if ($_POST['action'] === 'update_status' && isset($_POST['id'], $_POST['status'])) {
        $stmt = $pdo->prepare("UPDATE contact_suggestions SET status = :status WHERE id = :id");
        $stmt->execute([':status' => $_POST['status'], ':id' => $_POST['id']]);
        header('Location: admin.php');
        exit;
    }

    // Get all suggestions
    $stmt = $pdo->prepare("
        SELECT * FROM contact_suggestions 
        ORDER BY created_at DESC 
        LIMIT 100
    ");
    $stmt->execute();
    $suggestions = $stmt->fetchAll();

} catch (PDOException $e) {
    die('Database error: ' . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OSINT Navigator - Contact Suggestions Admin</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #007bff; color: white; }
        tr:hover { background-color: #f5f5f5; }
        .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status-new { background: #ffc107; color: #000; }
        .status-reviewed { background: #17a2b8; color: white; }
        .status-in_progress { background: #fd7e14; color: white; }
        .status-completed { background: #28a745; color: white; }
        .status-rejected { background: #dc3545; color: white; }
        .details { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .details:hover { white-space: normal; overflow: visible; }
        select { padding: 4px; border: 1px solid #ddd; border-radius: 4px; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat-card { background: #007bff; color: white; padding: 15px; border-radius: 8px; text-align: center; flex: 1; }
    </style>
</head>
<body>
    <div class="container">
        <h1>OSINT Navigator - Contact Suggestions</h1>
        
        <div class="stats">
            <?php
            $stats = $pdo->query("
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
                    SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today_count
                FROM contact_suggestions
            ")->fetch();
            ?>
            <div class="stat-card">
                <h3><?= $stats['total'] ?></h3>
                <p>Total Suggestions</p>
            </div>
            <div class="stat-card">
                <h3><?= $stats['new_count'] ?></h3>
                <p>New</p>
            </div>
            <div class="stat-card">
                <h3><?= $stats['completed_count'] ?></h3>
                <p>Completed</p>
            </div>
            <div class="stat-card">
                <h3><?= $stats['today_count'] ?></h3>
                <p>Today</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($suggestions as $suggestion): ?>
                <tr>
                    <td><?= htmlspecialchars($suggestion['id']) ?></td>
                    <td><?= date('M j, Y H:i', strtotime($suggestion['created_at'])) ?></td>
                    <td><?= htmlspecialchars($suggestion['name']) ?></td>
                    <td><a href="mailto:<?= htmlspecialchars($suggestion['email']) ?>"><?= htmlspecialchars($suggestion['email']) ?></a></td>
                    <td><?= ucfirst(htmlspecialchars($suggestion['suggestion_type'])) ?></td>
                    <td class="details" title="<?= htmlspecialchars($suggestion['details']) ?>">
                        <?= htmlspecialchars(substr($suggestion['details'], 0, 100)) ?>
                        <?= strlen($suggestion['details']) > 100 ? '...' : '' ?>
                    </td>
                    <td>
                        <span class="status status-<?= $suggestion['status'] ?>">
                            <?= ucfirst(str_replace('_', ' ', $suggestion['status'])) ?>
                        </span>
                    </td>
                    <td>
                        <form method="POST" style="display: inline;">
                            <input type="hidden" name="action" value="update_status">
                            <input type="hidden" name="id" value="<?= $suggestion['id'] ?>">
                            <select name="status" onchange="this.form.submit()">
                                <option value="new" <?= $suggestion['status'] === 'new' ? 'selected' : '' ?>>New</option>
                                <option value="reviewed" <?= $suggestion['status'] === 'reviewed' ? 'selected' : '' ?>>Reviewed</option>
                                <option value="in_progress" <?= $suggestion['status'] === 'in_progress' ? 'selected' : '' ?>>In Progress</option>
                                <option value="completed" <?= $suggestion['status'] === 'completed' ? 'selected' : '' ?>>Completed</option>
                                <option value="rejected" <?= $suggestion['status'] === 'rejected' ? 'selected' : '' ?>>Rejected</option>
                            </select>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        
        <?php if (empty($suggestions)): ?>
        <p style="text-align: center; color: #666; margin-top: 40px;">No suggestions yet.</p>
        <?php endif; ?>
    </div>
</body>
</html>