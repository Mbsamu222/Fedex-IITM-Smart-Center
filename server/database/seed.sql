-- FedEx SMART Center Seed Data
-- Run after schema.sql

-- Admin User (password: admin123)
-- bcrypt hash for 'admin123'
INSERT INTO admin_users (name, email, password_hash) VALUES
('Admin', 'admin@smartcenter.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9I0W4Y5GhBPKRUqXXzGBM3sHGy');

-- Hero Section
INSERT INTO hero_sections (title, subtitle, description, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, image_url, title_highlight, floating_tag, floating_text, is_active) VALUES
('Engineering the future of supply chains.', 
 'A joint initiative of IIT Madras & FedEx',
 'The SMART Center advances Supply Chain Modelling, Algorithms, Research and Technology — uniting world-class academic research with global logistics expertise to solve problems at planetary scale.',
 'Explore Research', '#research',
 'View Projects', '#projects',
 '/uploads/hero_supply_chain.png',
 'supply chains.',
 'Live research', 'National Logistics Digital Twin — modelling freight flows across India.',
 true),
('Optimizing multi-modal freight networks.',
 'Logistics Optimization & Operations',
 'Pioneering mathematical programming and optimization algorithms to streamline freight transport across road, rail, and sea lanes.',
 'Our Research', '#research',
 'View Case Studies', '/publications',
 '/uploads/hero_freight_network.png',
 'freight networks.',
 'Network Design', 'Multi-modal routing algorithms for large-scale operations.',
 true),
('Predictive intelligence for global logistics.',
 'AI Technology & Neural Networks',
 'Deploying time-series transformers and foundation models to achieve SKU-level demand forecasting and real-time operational adaptability.',
 'AI Research', '#research',
 'See Publications', '/publications',
 '/uploads/hero_predictive_intelligence.png',
 'global logistics.',
 'AI Models', 'SKU-level forecasting models powered by deep learning.',
 true),
('Autonomous aerial last-mile logistics.',
 'Autonomous Last-Mile Delivery',
 'Developing path-planning algorithms and drone platform optimization for fast, last-mile package distribution in urban and remote areas.',
 'Drone Research', '#research',
 'Watch Demo', '/gallery',
 '/uploads/hero_autonomous_delivery.png',
 'last-mile logistics.',
 'Drone Tech', 'Path-planning algorithms for last-mile autonomous deliveries.',
 true);

-- Stats
INSERT INTO stats (label, value, suffix, icon, sort_order) VALUES
('Research Papers', '150', '+', 'FileText', 1),
('Industry Projects', '45', '+', 'Briefcase', 2),
('Team Members', '80', '+', 'Users', 3),
('Partner Organizations', '25', '+', 'Building', 4);

-- Research Areas
INSERT INTO research_areas (title, description, icon, sort_order) VALUES
('AI & Machine Learning', 'Foundational models powering predictive and prescriptive supply chain intelligence.', 'Brain', 1),
('Drone Logistics', 'Autonomous aerial delivery research for last-mile and remote distribution.', 'Plane', 2),
('Demand Forecasting', 'Statistical and deep-learning approaches for resilient, high-accuracy forecasts.', 'TrendingUp', 3),
('Logistics Infrastructure', 'Network design, warehousing, and intermodal optimisation at national scale.', 'Building', 4),
('Worker Wellness', 'Human-centred research on ergonomics, safety, and frontline workforce wellbeing.', 'Heart', 5),
('Sustainability', 'Decarbonising supply chains through circularity, routing, and green logistics.', 'Leaf', 6),
('Digital Twin Systems', 'Live digital replicas of physical operations for simulation and control.', 'Monitor', 7);

-- Projects
INSERT INTO projects (title, description, is_featured, sort_order) VALUES
('National-scale Logistics Digital Twin', 'A high-fidelity simulation platform modelling India''s freight network across road, rail, air, and inland waterways.', true, 1),
('Foundation Models for Forecasting', 'Pretrained time-series transformers tailored for SKU-level demand across retail and industrial categories.', true, 2),
('Green Last-Mile Routing', 'Joint vehicle-and-route optimisation reducing CO2 intensity for urban delivery fleets.', true, 3),
('Autonomous Warehouse Orchestration', 'Multi-agent coordination for AMRs in high-throughput sortation environments.', true, 4);

-- Events
INSERT INTO events (title, description, event_type, is_featured, sort_order) VALUES
('AI Agents & GenAI for Enterprise Transformation — Certificate Program', 'A three-month online program offered jointly by CODE IIT Madras and the IIT Madras FedEx SMART Center. Ten modules including optimization engines, agentic AI, demand intelligence, and ESG sustainability, with live Saturday sessions and hands-on experience with 10+ GenAI tools. Applications open for Batch 2.', 'program', true, 1),
('Call for Applications — FedEx SMART GDC I-NCUBATE', 'The FedEx SMART GDC I-NCUBATE startup bootcamp is now open for applications.', 'announcement', true, 2),
('Navigating Disrupting Times: How Leaders Navigate Disruptive, Unpredictable, Fast-Changing Environments', 'Mr. Deepak Puligadda, Global Chief Technology Officer at Redington Limited, speaks as part of the IIT Madras FedEx SMART Center Seminar Series.', 'seminar', false, 3),
('What''s brewing at IIT Madras FedEx SMART Center? Batch 2 launch', 'On popular demand — launching Batch 2 of our flagship industry-focused learning program.', 'announcement', false, 4),
('Cross-Border Logistics: Sustainability and Intelligent Decision-Making', 'Online seminar by Mr. Raghunandanan, P&L Head — South, Rohlig Logistics, aligned with our vision of knowledge-dissemination for researchers, faculty, interns, and industry professionals.', 'seminar', false, 5),
('FedEx SMART Hackathon', 'PAN-India theme-based competition organised with Shaasthra on Reimagining Debt Collection Agency Management through Digital & AI Solutions. 2,500+ registrations, 400 project submissions, 15 finalists.', 'hackathon', true, 6),
('Decentralised Multi-Agent Reinforcement Learning of Stochastic Shortest Paths', 'Prof. N. Hemachandra, Industrial Engineering and Operations Research, IIT Bombay, presents at the IIT Madras-led FedEx SMART Seminar Series.', 'seminar', false, 7);

-- Blogs
INSERT INTO blogs (title, excerpt, author, category, published_date) VALUES
('Decarbonising last-mile logistics in Indian cities', 'How modelling EV charging networks at city scale changes the math on emissions.', 'SMART Center', 'Sustainability', '2026-06-15'),
('Agentic AI for warehouse tech simplification', 'From SOPs to copilots — bringing LLM agents to the warehouse floor.', 'SMART Center', 'AI & ML', '2026-06-01'),
('Worker wellness, instrumented', 'Wearables, vision and ergonomics research informing safer warehouse operations.', 'SMART Center', 'Worker Wellness', '2026-05-20'),
('Making India a global transshipment hub', 'Network design choices that could position India at the centre of global air cargo.', 'SMART Center', 'Logistics', '2026-05-10'),
('3D bin packing meets real-world ULDs', 'Why textbook bin-packing breaks down in air-freight loading — and what works.', 'SMART Center', 'Algorithms', '2026-04-25'),
('Inside the SMART Grand Challenge', 'Behind the scenes of our flagship student innovation contest.', 'SMART Center', 'Events', '2026-04-10');

-- Publications
INSERT INTO publications (title, authors, venue, year, abstract) VALUES
('Scenario-based Optimization for Resilient Urban Logistics', 'Dr. Anish Monseley, Pranesh Kannan, Snazal Singh, Prof. Balasubramaniam Natarajan, Prof. Babji Srinivasan', 'IFAC/INSTICC IN4PL 2025', 2025, 'A scenario-based optimization framework supporting resilient urban-logistics fulfillment under disruption. Combines Linear Programming and Unbalanced Optimal Transport to balance cost efficiency with service equity across Chennai case studies.');

-- Team Members - Advisory Board
INSERT INTO team_members (name, title, department, category, sort_order) VALUES
('Prof. V. Kamakoti', 'Director, IIT Madras', 'IIT Madras', 'advisory', 1),
('Kami Viswanathan', 'President, FedEx MEISA', 'FedEx', 'advisory', 2),
('Prof. R. Nagarajan', 'Dean, ICSR, IIT Madras', 'IIT Madras', 'advisory', 3),
('Prof. Devendra Jalihal', 'Dean, Planning, IIT Madras', 'IIT Madras', 'advisory', 4),
('Suvendu Choudhury', 'VP Operations, FedEx India', 'FedEx', 'advisory', 5),
('Mohammed Sayeed', 'MD, FedEx Express TSCS India', 'FedEx', 'advisory', 6);

-- Team Members - Executive Committee
INSERT INTO team_members (name, title, department, category, sort_order) VALUES
('Prof. Arshinder Kaur', 'Center Head, IIT Madras', 'Dept. of Management Studies', 'executive', 1),
('Prof. B. Ravindran', 'Co-Head, IIT Madras', 'IIT Madras', 'executive', 2),
('Prof. Gitakrishnan Ramadurai', 'Co-Head, IIT Madras', 'Wadhwani School of Data Science and AI', 'executive', 3),
('Prof. Rajagopalan Srinivasan', 'Co-Head, IIT Madras', 'IIT Madras', 'executive', 4),
('Mohammed Sayeed', 'Executive Sponsor, FedEx', 'FedEx', 'executive', 5),
('Suvendu Choudhury', 'Executive Sponsor, FedEx', 'FedEx', 'executive', 6);

-- Team Members - Center Team
INSERT INTO team_members (name, title, department, email, category, sort_order) VALUES
('Ms. Geetha UdayaKumar', 'Center Coordinator', 'SMART Center', 'fedexiitm.admin@imail.iitm.ac.in', 'center', 1),
('Vara Kalyani Naidu', 'Senior Project Manager', 'SMART Center', 'fedexiitm.pm@imail.iitm.ac.in', 'center', 2),
('Preethi P Ramaswamy', 'Project Manager', 'SMART Center', 'smartcenter.fedexiitm@gmail.com', 'center', 3);

-- Team Members - Faculty
INSERT INTO team_members (name, title, department, email, category, sort_order) VALUES
('Dr. Arshinder Kaur', 'Faculty', 'Dept. of Management Studies', 'arshinder@iitm.ac.in', 'faculty', 1),
('Dr. Babji Srinivasan', 'Faculty', 'Dept. of Applied Mechanics', 'babji.srinivasan.iitm@gmail.com', 'faculty', 2),
('Dr. Gitakrishnan Ramadurai', 'Faculty', 'Wadhwani School of Data Science and AI', 'gitakrishnan@iitm.ac.in', 'faculty', 3);

-- Site Settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'IIT Madras FedEx SMART Center'),
('site_tagline', 'Supply Chain Modelling, Algorithms, Research and Technology'),
('contact_phone', '044 2257 9668'),
('contact_email', 'fedexiitm.admin@imail.iitm.ac.in'),
('contact_address', 'NAC 1, Stilt floor, Indian Institute of Technology Madras, Chennai, Tamil Nadu 600036'),
('footer_disclaimer', 'Official page of the IIT Madras-led FedEx SMART Center. All expressions/posts/opinions are solely handled by IIT Madras.'),
('copyright_text', '© 2026 Indian Institute of Technology Madras. All Rights Reserved.');
