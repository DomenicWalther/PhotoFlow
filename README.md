# PhotoFlow

PhotoFlow is a SvelteKit web application designed for organizing photography orders and clients, complete with an integrated Kanban board feature. Whether you're a professional photographer managing multiple clients or an amateur enthusiast looking to streamline your workflow, PhotoFlow provides an intuitive solution for keeping track of your photography projects.
This Project first came to live to solve the following Problem I've had at work:
- We were using Pen & Paper to keep track of all current orders in a list.
- Since the way we handle orders is pretty dynamic and the order isn't fixed the list had to be rewritten a lot since orders got finished but some still had to be done
- Solution: Keep track of all Orders digitally
- Issues:
    1. We don't have access to the Internet, but rather have an internal Network of connected PC's. Any existing solution needing Internet wouldn't work.
    2. We were trying out using Excel Tables, but these couldn't be easily accessed/modified by multiple PC's in the Network at once.
       As a small company with 4 Employees, all Tasks should be synced through the entire network.

    My solution was using vite's host feature to allow the other PC's in the Network access the App.
    The Server is running on one PC, all PC's can send Requests to get/write Data. Only the Server then gets/writes the Data from/to the Database, removing synchronization issues.
    Socket.io is used to automatically refresh the other PC's data whenever there has been a change in the database.
## Installation

Before getting started with PhotoFlow, ensure that you have Node.js installed on your system. You can download and install Node.js from [here](https://nodejs.org/).

To install PhotoFlow, follow these steps:

1. Clone the GitHub repository to your local machine:

```
git clone https://github.com/DomenicWalther/PhotoFlow.git
```

### Download ZIP Archive (Alternative Method)

Alternatively, you can download the project as a ZIP archive from the GitHub repository page. Follow these steps:

1. Visit the [PhotoFlow GitHub repository](https://github.com/DomenicWalther/photoflow).
2. Click on the green "Code" button.
3. Select "Download ZIP" from the dropdown menu.
4. Once the ZIP file is downloaded, extract its contents to your desired location on your local machine.

5. Navigate to the project directory:

```
cd PhotoFlow
```

3. Install dependencies using npm:

```
npm install
```

4. Create the Database using prisma:

```
prisma migrate dev --name init
```

5. Build the application:

```
npm run build
```

## Usage

Once the installation process is complete, you can start using PhotoFlow by following these steps:

1. Start the application using the following command:

```
npm run preview -- --host
```

2. Open your web browser and navigate to the provided URL (usually `http://localhost:4173`) to access PhotoFlow.

3. Begin by creating a new project or importing existing client data to start organizing your photography orders.

4. Utilize the Kanban board feature to visualize the progress of your projects and efficiently manage tasks.

## Features

- **Client Management:** Easily manage client information, including contact details, project preferences, and order history.
- **Order Tracking:** Keep track of photography orders, including details such as shoot dates, payment status, and delivery deadlines.
- **Kanban Board:** Visualize project progress using a Kanban-style board, allowing for seamless task management and workflow optimization.

## Contributing

I welcome contributions from the community to enhance PhotoFlow further. If you have any ideas for new features, improvements, or bug fixes, please feel free to submit a pull request or open an issue on GitHub.

## License

PhotoFlow is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions, suggestions, or feedback regarding PhotoFlow, please don't hesitate to contact me at [domenic.walther@gmx.de](mailto:domenic.walther@gmx.de). I'd love to hear from you!
