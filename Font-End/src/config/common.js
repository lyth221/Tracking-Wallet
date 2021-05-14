module.exports = app => {
    // app create folder
    app.createFolder = dirs => {
        if (!Array.isArray(dirs)) dirs = [dirs];
        dirs.forEach(dir => {
            if (!app.fs.existsSync(dir)) app.fs.mkdirSync(dir);
        });

    };
};