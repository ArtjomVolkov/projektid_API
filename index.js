const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const port = 8080;

const projects = [
    {
        id: 1,
        project_name: 'Проект 1',
        tasks: [
            {
                report_id: 1,
                user: {
                    first_name: 'asdasdas',
                    last_name: 'dasdasd',
                    role: 'Директор',
                    profession: 'Веб-разработчик'
                },
                entry_time: 323,
                status: 'подтверждена'
            },
            // Добавьте другие задачи и пользователей по аналогии
        ]
    },
    {
        id: 2,
        project_name: 'Проект 2',
        tasks: [
            {
                report_id: 4,
                user: {
                    first_name: 'sadsadasda',
                    last_name: 'xzczxczsdasd',
                    role: 'Директор',
                    profession: 'Веб-разработчик'
                },
                entry_time: 13,
                status: 'подтверждена'
            },
            // Добавьте другие задачи и пользователей по аналогии
        ]
    }
];

app.get('/projects', (req, res) => {
    res.send(projects);
});

// Добавление нового проекта
app.post('/projects', (req, res) => {
    if (!req.body.project_name) {
        return res.status(400).send({ error: 'Project name is required' });
    }

    const newProject = {
        id: projects.length + 1,
        project_name: req.body.project_name,
        tasks: []
    };

    projects.push(newProject);

    res.status(201).location(`${getBaseUrl(req)}/projects/${newProject.id}`).send(newProject);
});

// Удаление проекта
app.delete('/projects/:id', (req, res) => {
    const projectId = parseInt(req.params.id, 10);
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) {
        return res.status(404).send({ error: 'Project not found' });
    }

    projects.splice(projectIndex, 1);

    res.status(204).send({ error: 'No content' });
});

// Обновление данных проекта
app.put('/projects/:id', (req, res) => {
    const projectId = parseInt(req.params.id, 10);
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
        return res.status(404).send({ error: 'Project not found' });
    }

    if (req.body.project_name) {
        project.project_name = req.body.project_name;
    }

    res.status(200).send(project);
});

app.post('/projects/:id/tasks', (req, res) => {
    const projectId = parseInt(req.params.id, 10);
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        return res.status(404).send({ error: 'Project not found' });
    }

    const user = {
        first_name: req.body.newFirstName,
        last_name: req.body.newLastName,
        role: req.body.role,
        profession: req.body.profession,
    };

    // Создаем новую задачу
    const newTask = {
        report_id: project.tasks.length + 1,
        user: user,
        entry_time: 0, // Инициализируйте как нужно
        status: 'Ожидание проверки' // Инициализируйте как нужно
    };

    // Добавляем новую задачу к проекту
    project.tasks.push(newTask);

    res.status(201).send(newTask);
});

app.get('/projects/:id/tasks/:report_id', (req, res) => {
    const projectId = parseInt(req.params.id, 10);
    const reportId = parseInt(req.params.report_id, 10);
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
        return res.status(404).send({ error: 'Project not found' });
    }

    const task = project.tasks.find((t) => t.report_id === reportId);

    if (!task) {
        return res.status(404).send({ error: 'Task not found' });
    }

    res.status(200).send(task);
});
app.delete('/projects/:id/tasks/:report_id', (req, res) => {
    const projectId = parseInt(req.params.id, 10); // Замените req.params.projectId на req.params.id
    const reportId = parseInt(req.params.report_id, 10); // Замените req.params.reportId на req.params.report_id
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
        return res.status(404).send({ error: 'Project not found' });
    }

    const taskIndex = project.tasks.findIndex((task) => task.report_id === reportId);
    if (taskIndex === -1) {
        return res.status(404).send({ error: 'Task not found' });
    }

    project.tasks.splice(taskIndex, 1);

    res.status(204).send({ error: 'No content' });
});

app.put('/projects/:id/tasks/:report_id', (req, res) => {
    const projectId = parseInt(req.params.id, 10); // Замените req.params.projectId на req.params.id
    const reportId = parseInt(req.params.report_id, 10); // Замените req.params.reportId на req.params.report_id
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
        return res.status(404).send({ error: 'Project not found' });
    }

    const task = project.tasks.find((t) => t.report_id === reportId);
    if (!task) {
        return res.status(404).send({ error: 'Task not found' });
    }

    if (req.body.user) {
        
        task.user = req.body.user;
    }
    if (req.body.entry_time) {
        task.entry_time = req.body.entry_time;
    }
    if (req.body.status) {
        task.status = req.body.status;
    }

    res.status(200).send(task);
});

app.listen(port, () => {
    console.log(`API is up at: http://localhost:${port}`);
});

function getBaseUrl(req) {
    return req.connection && req.connection.encrypted ? 'https' : 'http' + `://${req.headers.host}`;
}
