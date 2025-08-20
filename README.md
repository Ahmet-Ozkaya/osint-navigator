osint-navigator

## Database Setup for Contact Form

The contact form is integrated with MySQL database. To set it up:

1. **Create the database table** by running the SQL script in `public/api/create_table.sql`
2. **Upload the PHP files** from `public/api/` to your web server
3. **Configure database connection** in `contact.php` if needed
4. **Access admin panel** at `/api/admin.php` to view submissions

### Database Configuration
- Host: localhost
- Database: novasaas_osint_contact
- User: novasaas_contact_db_admin
- Password: KontakVeryYoneticisi25%

### Features
- Secure form submission with validation
- Admin panel to view and manage suggestions
- Status tracking (new, reviewed, in progress, completed, rejected)
- Email notifications ready for integration
- IP address and user agent logging for security