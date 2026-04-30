-- Seed services for Srinagar Dental Clinic
INSERT INTO services (clinic_id, name, description, duration, price_from, price_to, rating, review_count) VALUES
('srinagar-dental-bangalore', 'Consultation', 'Comprehensive examination and treatment planning.', '30 min', 300, NULL, 4.6, 45),
('srinagar-dental-bangalore', 'Root Canal Treatment', 'Single-sitting RCT with rotary instruments.', '60–90 min', 2000, NULL, 4.5, 32),
('srinagar-dental-bangalore', 'Extraction', 'Simple and surgical extractions.', '20–45 min', 500, NULL, 4.6, 28),
('srinagar-dental-bangalore', 'Dental Implants', 'Titanium implants with crown restoration.', '3–4 sittings', 30000, NULL, 4.7, 18),
('srinagar-dental-bangalore', 'Cleaning', 'Ultrasonic scaling and polishing.', '30 min', 1000, NULL, 4.6, 52),
('srinagar-dental-bangalore', 'Braces & Aligners', 'Metal wired, ceramic self-ligating, and clear aligner options.', '12–18 months', 25000, 55000, 4.7, 38);

-- Seed service variants for Srinagar Dental Clinic
INSERT INTO service_variants (service_id, type, price, price_min, price_max, duration) VALUES
((SELECT id FROM services WHERE clinic_id = 'srinagar-dental-bangalore' AND name = 'Braces & Aligners'), 'Metal Wired', 25000, NULL, NULL, '12–18 months'),
((SELECT id FROM services WHERE clinic_id = 'srinagar-dental-bangalore' AND name = 'Braces & Aligners'), 'Self-Ligating Ceramic', 55000, NULL, NULL, '12–18 months'),
((SELECT id FROM services WHERE clinic_id = 'srinagar-dental-bangalore' AND name = 'Braces & Aligners'), 'Clear Aligners', NULL, 42000, 65000, '8–12 months');

-- Seed services for Carewell Dental Clinic
INSERT INTO services (clinic_id, name, description, duration, price_from, price_to, rating, review_count) VALUES
('carewell-dental-bangalore', 'Consultation', 'Detailed examination with treatment recommendations.', '30 min', 300, NULL, 4.7, 61),
('carewell-dental-bangalore', 'Root Canal Treatment', 'Advanced RCT techniques for complex cases.', '60–90 min', 3500, 4500, 4.7, 49),
('carewell-dental-bangalore', 'Extraction', 'Simple and surgical tooth extractions.', '20–60 min', 300, 5000, 4.6, 38),
('carewell-dental-bangalore', 'Dental Implants', 'Premium implants with ceramic crowns.', '2–3 sittings', 23000, 40000, 4.8, 32),
('carewell-dental-bangalore', 'Braces', 'Fixed braces and clear aligner therapy.', '18–24 months', 35000, 55000, 4.7, 42),
('carewell-dental-bangalore', 'Cleaning', 'Professional scaling and polishing.', '30–45 min', 800, 1700, 4.7, 68);

-- Seed service variants for Carewell Dental Clinic
INSERT INTO service_variants (service_id, type, price, price_min, price_max, duration) VALUES
((SELECT id FROM services WHERE clinic_id = 'carewell-dental-bangalore' AND name = 'Root Canal Treatment'), 'Standard RCT', 3500, NULL, NULL, '60 min'),
((SELECT id FROM services WHERE clinic_id = 'carewell-dental-bangalore' AND name = 'Root Canal Treatment'), 'Complex RCT', 4500, NULL, NULL, '90 min'),
((SELECT id FROM services WHERE clinic_id = 'carewell-dental-bangalore' AND name = 'Extraction'), 'Simple Extraction', 300, NULL, NULL, '15–20 min'),
((SELECT id FROM services WHERE clinic_id = 'carewell-dental-bangalore' AND name = 'Extraction'), 'Surgical Extraction', NULL, 2000, 5000, '45–60 min'),
((SELECT id FROM services WHERE clinic_id = 'carewell-dental-bangalore' AND name = 'Dental Implants'), 'Single Implant', 23000, NULL, NULL, '2–3 months'),
((SELECT id FROM services WHERE clinic_id = 'carewell-dental-bangalore' AND name = 'Dental Implants'), 'Multiple Implants', NULL, 30000, 40000, '3–4 months'),
((SELECT id FROM services WHERE clinic_id = 'carewell-dental-bangalore' AND name = 'Braces'), 'Metal Braces', NULL, 35000, 45000, '18–24 months'),
((SELECT id FROM services WHERE clinic_id = 'carewell-dental-bangalore' AND name = 'Braces'), 'Clear Aligners', NULL, 45000, 55000, '12–18 months'),
((SELECT id FROM services WHERE clinic_id = 'carewell-dental-bangalore' AND name = 'Cleaning'), 'Basic Cleaning', 800, NULL, NULL, '30 min'),
((SELECT id FROM services WHERE clinic_id = 'carewell-dental-bangalore' AND name = 'Cleaning'), 'Deep Cleaning', 1700, NULL, NULL, '45 min');

-- Seed services for Deep Dental Clinic
INSERT INTO services (clinic_id, name, description, duration, price_from, price_to, rating, review_count) VALUES
('deep-dental-bangalore', 'Consultation', 'Comprehensive dental examination.', '30 min', 300, NULL, 4.6, 35),
('deep-dental-bangalore', 'Root Canal Treatment', 'Precision RCT using modern techniques.', '60–90 min', 4000, NULL, 4.6, 28),
('deep-dental-bangalore', 'Extraction', 'Safe tooth extraction with minimal trauma.', '20–60 min', 1000, 6000, 4.5, 22),
('deep-dental-bangalore', 'Dental Implants', 'Complete implant restoration.', '3–4 sittings', 25000, NULL, 4.7, 21),
('deep-dental-bangalore', 'Braces & Aligners', 'Multiple orthodontic options available.', '18–24 months', 40000, 85000, 4.6, 35),
('deep-dental-bangalore', 'Cleaning', 'Professional tooth cleaning and polishing.', '30–45 min', 1000, 2000, 4.6, 42);

-- Seed service variants for Deep Dental Clinic
INSERT INTO service_variants (service_id, type, price, price_min, price_max, duration) VALUES
((SELECT id FROM services WHERE clinic_id = 'deep-dental-bangalore' AND name = 'Extraction'), 'Simple Extraction', 1000, NULL, NULL, '20 min'),
((SELECT id FROM services WHERE clinic_id = 'deep-dental-bangalore' AND name = 'Extraction'), 'Surgical Extraction', NULL, 3000, 6000, '45–60 min'),
((SELECT id FROM services WHERE clinic_id = 'deep-dental-bangalore' AND name = 'Braces & Aligners'), 'Metal Wired Braces', 40000, NULL, NULL, '18–24 months'),
((SELECT id FROM services WHERE clinic_id = 'deep-dental-bangalore' AND name = 'Braces & Aligners'), 'Self-Ligating Braces', 60000, NULL, NULL, '18–24 months'),
((SELECT id FROM services WHERE clinic_id = 'deep-dental-bangalore' AND name = 'Braces & Aligners'), 'Clear Aligners', NULL, 45000, 85000, '12–18 months'),
((SELECT id FROM services WHERE clinic_id = 'deep-dental-bangalore' AND name = 'Cleaning'), 'Basic Cleaning', 1000, NULL, NULL, '30 min'),
((SELECT id FROM services WHERE clinic_id = 'deep-dental-bangalore' AND name = 'Cleaning'), 'Advanced Cleaning', 2000, NULL, NULL, '45 min');
