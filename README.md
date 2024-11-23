# Task 1: Requirement Elicitation (1.1, 1.2)

## 1.1 Domain Context

### 1.1.1 Introduction

Currently, the printing needs of university students at Ho Chi Minh City University of Technology (HCMUT) are increasing. Printed hard copies of study materials are becoming more useful in students' learning processes. However, with the traditional method of providing printing services through print shops, there are still some existing issues such as:

- Students may have to travel long distances to reach print shops.
- Print requests can only be submitted at the print shop, meaning students must wait for their requests to be completed.
- The number of students thoroughly outweighs the number of print shops, so students often have to wait in long lines during peak hours.
- There is no guarantee that the information in the printed documents will not be disclosed when sent to the print shop.
- Printing services often do not post or fix their prices, making it difficult for students to manage their printing expenses.

### 1.1.2 Solution

The HCMUT Student Smart Printing Service (HCMUT-SSPS) is designed to enhance the printing experience for students at Ho Chi Minh City University of Technology (HCMUT). As universities increasingly adopt digital platforms, the need for efficient, accessible printing service seems critical. The HCMUT_SSPS will facilitate a streamlined approach, allowing students to easily upload documents, select from a network of printers across the campus, and customize their printing preferences through a web-based and mobile application.

### 1.1.3 Scope of the System

- The system targets students at HCMUT, providing convenient printing services among the university campuses.
- The system only supports online payments, but does not support debit features or points accumulation.

## 1.2 Stakeholders and Needs

### 1.2.1 Students

As the primary users of the HCMUT_SSPS, they require a convenient and reliable platform for efficient document printing. A user-friendly interface, coupled with the flexibility to select printers and preferences tailored to their academic needs, are essential features to enhance their overall experience.

### 1.2.2 Student Printing Service Officer (SPSO)

SPSO is another key stakeholder in the HCMUT_SSPS. The system should provide the SPSO with comprehensive tools to monitor and manage printer usage.

### 1.2.3 University

The university needs to provide printing services for students to make document printing more convenient, as well as to offer a better platform for students to manage their printing needs.

### 1.2.4 BKPay

As the university's online payment platform, BKPay needs to integrate seamlessly with the HCMUT_SSPS to provide a convenient and efficient method for students to purchase printing credits.

### 1.2.5 IT Staff

They are responsible for maintaining the system and require effective tools to ensure its smooth operation. These tools should enable them to address technical issues and safeguard data security.

### 1.2.6 Guests

Guests are users who are not logged into the system. They only have the right to view basic information about the school's printing services. Guests need access to contact information to send inquiries or request support.

## 1.3 Benefits of the System

### 1.3.1 Students

The service simplifies the printing process, enabling them to upload documents and manage printing preferences easily. This convenience, coupled with the ability to purchase additional printing pages through BKPay, enhances their academic experience.

### 1.3.2 Student Printing Service Officer (SPSO)

The system offers comprehensive management features that facilitate monitoring and reporting on printer usage, making it easier for SPSO to manage resources and maintain service standards.

### 1.3.3 University

The university can enhance its reputation with individuals and organizations outside the school.

### 1.3.4 BKPay

BKPay benefits by integrating with a service that increases its usage among students, generating additional revenue.

### 1.3.5 IT Staff

The system provides a structured platform that simplifies technical support and maintenance tasks, ensuring smooth operation and security.

### 1.3.6 Guests

Guests will be able to find out more about HCMUT-SSPS, helping them decide whether or not to use the service later on.

## 1.4 Functional Requirements

### 1.4.1 Students

- Students can upload document files for printing in permitted file formats.
- Students can select a printer and specify printing properties (paper size, pages to print, one-/double-sided, number of copies, etc.).
- Students can view their personal printing log for a specified time period.
- Students can buy additional printing pages through the system and pay with BKPay.
- Each student using the system shall be uniquely identified by their student ID number.
- Students should not be able to print if the requested number of pages exceeds their balance.
- The system must keep a record and all related information of each student for each time the service is used, as well as keep them confidential.
- The system must notify via mail when a printing process completes.

### 1.4.2 Student Printing Service Officer (SPSO)

- SPSO can view the printing history for all students or specific students for a specified time period.
- SPSO can view reports and logs filtered by student, printer, or date.
- SPSO can add, enable, or disable printers in the system.
- SPSO can change system configurations (default page allowances, permitted file types).
- SPSO can oversee the overall system performance.
- SPSO can oversee all printers’ configurations (ID, brand/manufacturer name, printer model, short description, and the location).
- SPSO can oversee all printers’ usage.

### 1.4.3 University

- The university can set the default number of A4 pages allocated to each student each semester.
- The university can specify the dates when the default number of pages is given to students.
- The university can oversee the overall system performance.
- The university can oversee all printers’ configurations (ID, brand/manufacturer name, printer model, short description, and the location).
- The university can oversee all printers’ usage.

### 1.4.4 BKPay

- BKPay system shall allow students to securely purchase additional printing pages through itself.
- BKPay shall integrate with the system to handle payments and update student page balances in real-time.
- BKPay shall provide transaction records to the system.
- BKPay shall notify students and the system of successful transactions and updates to their account balance.
- BKPay shall know that one A3 page is equivalent to two A4 pages and charge based on that.

### 1.4.5 IT Staff

- IT staff can integrate the system with the university's HCMUT_SSO authentication service.
- IT staff can monitor and maintain the server.
- IT staff can oversee all printers’ configurations (ID, brand/manufacturer name, printer model, short description, and the location).
- IT staff can oversee all printers’ usage.
- Each IT staff maintaining the system shall be uniquely identified by their employee ID.

### 1.4.6 Guests

- Guests can view information about the system.
- Guests can explore the system's key features.
- Guests can view a user guide for the system.
- Guests can contact the support team through the contact information provided on the system.
- Guests can also log in to the system and use the services.

## 1.5 Non-Functional Requirements

### UX

- The system shall be available to all campuses during working hours (8AM – 5PM, Monday – Saturday). Downtime within normal working hours shall not exceed 15 minutes.
- The system must have a response time of less than 30 seconds for uploading files and selecting printers.
- The system must have a response time of less than 60 seconds for processing transactions and updating students’ balance accounts.
- The system must handle up to 100 concurrent printing requests without performance degradation.
- The system must handle up to 500 concurrent users without performance degradation.
- The system’s user interface must be easy to use (students can effortlessly use it after 1 hour of initial interaction).

### UI

- The system must support both web and mobile platforms, with its user interface displayed well on various screen sizes.
- The system must provide straightforward error messages when something goes wrong (e.g., insufficient page balance, invalid file format).

### Configuration and Functionality

- All user data (login credentials and payment information) must be encrypted using TLS/SSL to ensure security.
- The system must be scalable to add new printers or support new campuses.
- The system must log all printing and payment actions and keep them for at least 1 year.
- The system must ensure compatibility with common web browsers and mobile platforms (Chrome, Safari, Android, iOS).
- Users must be authenticated by HCMUT_SSO before accessing the system.
- The system shall implement user privacy provisions as set out in applicable data protection laws and regulations.
