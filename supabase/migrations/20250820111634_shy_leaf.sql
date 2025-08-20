-- MySQL table creation script for OSINT Navigator Contact & Suggestions
-- Database: novasaas_osint_contact
-- Run this script in your MySQL database

CREATE TABLE IF NOT EXISTS contact_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    suggestion_type ENUM('feature', 'tool', 'bug', 'general') NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    status ENUM('new', 'reviewed', 'in_progress', 'completed', 'rejected') DEFAULT 'new',
    admin_notes TEXT NULL,
    
    -- Indexes for better performance
    INDEX idx_email (email),
    INDEX idx_suggestion_type (suggestion_type),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Create an admin users table for future authentication
CREATE TABLE IF NOT EXISTS contact_admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Indexes
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a sample admin user (password: admin123 - change this!)
-- Password hash for 'admin123' using PHP password_hash()
INSERT IGNORE INTO contact_admin_users (username, email, password_hash) 
VALUES ('admin', 'admin@yourdomain.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Show table structure
DESCRIBE contact_suggestions;