# PhotoFlow

PhotoFlow is a SvelteKit web application designed for organizing photography orders and clients, complete with an integrated Kanban board feature. Whether you're a professional photographer managing multiple clients or an amateur enthusiast looking to streamline your workflow, PhotoFlow provides an intuitive solution for keeping track of your photography projects.

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
