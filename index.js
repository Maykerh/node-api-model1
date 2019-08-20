const express = require('express');

const server = express();

server.use(express.json());

const projects = [{ id: 'pr0', title: 'project 0', tasks: [] }];
var counter = 0;

function checkProjectExists(req, res, next) {
    const projectId = req.params.id;
    var project = null;
    var index = null;

    projects.map((proj, index) => {
        if (proj.id === projectId) {
            project = proj;
            index = index;
        }
    });

    if (!projectId) {
        return res.status(400).json({ error: `Project with id ${projectId} doesn't exists` });
    }

    req.project = project;
    req.projectIndex = index;

    return next();
}

function callCounter(req, res, next) {
    console.log('Application called ' + ++counter + ' times');

    return next();
}

server.post('/projects', callCounter, (req, res) => {
    const { id, title } = req.body;

    projects.push({
        id,
        title
    });

    return res.json(projects);
});

server.get('/projects', callCounter, (req, res) => {
    return res.json(projects);
});

server.put('/projects/:id', callCounter, checkProjectExists, (req, res) => {
    req.project.title = req.body.title;

    return res.send();
});

server.delete('/projects/:id', callCounter, checkProjectExists, (req, res) => {
    projects.splice(req.projectIndex, 1);

    return res.send(projects);
});

server.post('/projects/:id/tasks', callCounter, checkProjectExists, (req, res) => {
    if (!req.project.tasks) {
        projects[index].tasks = [];
    }

    req.project.tasks.push(req.body.title);

    return res.json(projects);
});

server.listen(3000);
