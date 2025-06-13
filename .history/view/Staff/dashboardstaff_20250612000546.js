function toggleDropdown() {
            const dropdown = document.getElementById('userDropdown');
            dropdown.classList.toggle('show');
        }
         // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const userMenu = document.querySelector('.user-menu');
            const dropdown = document.getElementById('userDropdown');
            
            if (!userMenu.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Page navigation
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Add active class to clicked tab
            event.target.classList.add('active');
        }

        // User menu actions
        function showProfile() {
            alert('Profile page - Coming soon!');
            toggleDropdown();
        }

        function showSettings() {
            alert('Settings page - Coming soon!');
            toggleDropdown();
        }

        function showOrders() {
            showPage('current-orders');
            document.querySelector('[onclick="showPage(\'current-orders\')"]').classList.add('active');
            toggleDropdown();
        }
