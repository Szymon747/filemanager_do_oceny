
const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const formidable = require('formidable');
var hbs = require('express-handlebars');
const fs = require("fs")
const filepathorginal = path.join(__dirname, "files")

app.use(express.static('static'))
var tab = [{}];

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
//wczytanie istniejacych plikow i katalogow
var podgladanyplik = ""
var starykolor;
var staryfontsize;

maketab("NO.NE")
function maketab(path) {
    if (path == "NO.NE") {

    }
    else {
        // path.join(__dirname, "files", path)   tutaj skończyłem
    }
    fs.readdir(filepathorginal, (err, files) => {
        console.log("nastrpuje odczyt plikow i katalogow")
        while (tab.length > 0) {
            tab.pop();
        }



        if (err) throw err

        for (let i = 0; i < files.length; i++) {
            let v = {
                name: files[i]
                // type: 
                // size: 
            }
            let result = files[i].slice(files[i].indexOf(".") + 1, files[i].length);
            v.picture = result
            if (files[i].indexOf(".") < 1) {
                v.picture = "directory"
                v.directory = true
            }

            tab.push(v)
        }
        console.log(tab)
    })
}

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
app.get("/", function (req, res) {
    res.render('view3.hbs');
})
app.get("/filemanager", function (req, res) {
    maketab("NO.NE")
    res.render('view1.hbs', { t: tab });
})
app.get('/delete', function (req, res) {
    let helperpath = path.join(filepathorginal)
    console.log(req.query.id)
    console.log("usuwam plik lub katalog:" + helperpath)


    if (req.query.id == "all") {

        console.log("alek")
        for (let i = 0; i < tab.length; i++) {
            console.log(i)
            console.log(tab[i].name)
            deleteone(helperpath, tab[i].name)
        }
    }
    else {
        deleteone(helperpath, req.query.id)
    }
    function deleteone(helperpath, cousuwa) {
        let sciezka = path.join(helperpath, cousuwa)
        if (req.query.id.indexOf(".") >= 0) {
            console.log("plik")
            if (fs.existsSync(sciezka)) {
                console.log("plik istnieje");

                fs.unlink(sciezka, (err) => {
                    if (err) throw err
                    console.log("czas 1: " + new Date().getMilliseconds());
                })
                console.log("juz nie")
                maketab("NO.NE")
            } else {
                console.log("plik nie istnieje");
            }
        }
        else {
            console.log("katalog")

            if (fs.existsSync(sciezka)) {
                fs.rmdir(sciezka, (err) => {
                    if (err) throw err
                    console.log("usunieto katalog" + sciezka);
                    maketab("NO.NE")
                })
            }
            else {
                console.log("taki katalog nie istnieje")
            }
        }
    }








    res.render('view1.hbs', { t: tab })
})
app.get('/info', function (req, res) { //do dokonczenia bo dostaje id i wtedy jest to podglad konkretnego pliku

    let info = {};

    for (let i = 0; i < tab.length; i++) {
        if (tab[i].name == req.query.id) {

            info = tab[i]
        }
    }

    res.render('view2.hbs', { info });   // nie podajemy ścieżki tylko nazwę pliku
})
app.get("/upload", function (req, res) {
    res.render('view3.hbs');
})
app.get("/show", function (req, res) {
    res.render('view3.hbs');
});
app.get("/createplik", function (req, res) {
    const filepath1 = path.join(__dirname, "files", req.query.name)
    var exist = false

    fs.readdir(filepathorginal, (err, files) => {
        if (err) throw err
        console.log("lista przed  - ", files);
        for (let i = 0; i < files.length; i++) {                //sprtawedzanie czy juz istynieje taki plik
            if (files[i] == req.query.name) {
                exist = true
            }
        }
        if (exist == false) {

            fs.writeFile(filepath1, "", (err) => {
                if (err) throw err
                console.log("plik stworzony");
            })

            fs.readdir(filepathorginal, (err, files) => {
                if (err) throw err
                console.log("lista po  - ", files);
            })
            let result = req.query.name.slice(req.query.name.indexOf(".") + 1, req.query.name.length);




            let v = {
                name: req.query.name
                // type: 
                // size: 
            }
            console.log(result)
            v.picture = result


            tab.push(v)
        }
        else {
            console.log("nie dodano bo juz istnieje o tej nazwie")
        }

    })



    res.render('view1.hbs', { t: tab })
    console.log(req.query.name)
});
app.get("/podglad", function (req, res) {

    podgladanyplik = req.query.id
    console.log("podglad")
    let obiekt = {}
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].name == req.query.id) {
            obiekt = tab[i]
        }
    }
    console.log(obiekt)
    if (obiekt.directory == true) {
        console.log("podglad katalogu")
        maketab(obiekt.name)
        res.render('view1.hbs', { t: tab })
    }
    else {
        let editor = {}
        editor.name = req.query.id
        let podglad = path.join(__dirname, "files", req.query.id)

        //  filepathorginal
        fs.readFile(podglad, "utf-8", (err, data) => {
            if (err) throw err
            editor.text = data.toString();
        })

        fs.readFile('static/data.json', 'utf-8', (err, data) => {
            if (err) throw err
            const obj = JSON.parse(data)

            editor.fontsize = parseInt(obj.fontsize)
            editor.color = obj.color
            staryfontsize = parseInt(obj.fontsize)
            starykolor = obj.color
        })



        res.render('editor.hbs', { editor: editor });
    }

})
app.get("/createkatalog", function (req, res) {             //tworzenie katalogu
    const filepathorginal = path.join(__dirname, "files")
    const filepath1 = path.join(__dirname, "files", req.query.name)
    var exist = false

    fs.readdir(filepathorginal, (err, files) => {
        if (err) throw err
        console.log("lista przed  - ", files);
        for (let i = 0; i < files.length; i++) {                //sprtawedzanie czy juz istynieje taki katalog
            if (files[i] == req.query.name) {
                exist = true
            }
        }
        if (exist == false) {

            fs.mkdir(filepath1, (err) => {
                if (err) throw err
                console.log("dodano" + req.query.name);

                fs.readdir(filepathorginal, (err, files) => {
                    if (err) throw err
                    console.log("lista po  - ", files);
                })
            })


        }
        else {
            console.log("nie dodano bo juz istnieje o tej nazwie")
        }
        maketab("NO.NE")
    })


    res.render('view1.hbs', { t: tab })
    console.log(req.query.name)
});

app.post("/savetext", function (req, res) {
    console.log("savetext2 " + req.body.area)
    console.log(podgladanyplik)
    const filepath2 = path.join(__dirname, "files", podgladanyplik)

    fs.writeFile(filepath2, req.body.area, (err) => {
        if (err) throw err
        console.log("plik nadpisany");
    })



    res.render('view1.hbs', { t: tab })
})
app.post("/saveset", function (req, res) {
    console.log(req.body)
    console.log("saveset")
    console.log(req.body.color)
    console.log(req.body.fontsize)


    const jsonpath = path.join(__dirname, "static", "data.json")

    if (req.body.fontsize.length < 1) {
        req.body.fontsize=staryfontsize
    }


    let jsonstring = '{"fontsize":"' + req.body.fontsize + '","color":"' + req.body.color + '"}'
    fs.writeFile(jsonpath, jsonstring, (err) => {
        if (err) throw err
        console.log("json nadpisany");
    })





    res.render('view1.hbs', { t: tab })
})
app.post('/handleUpload', function (req, res) {  //upload plików
    let form = formidable({});

    form.multiples = true
    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia

    form.parse(req, function (err, fields, files) {




        if (Array.isArray(files.imagetoupload)) {      //kiedy dostane tablice a nie obiekt czyli kilka zdjec

            for (let i = 0; i < files.imagetoupload.length; i++) {

                let v = {
                    name: files.imagetoupload[i].name,
                    type: files.imagetoupload[i].type,
                    size: files.imagetoupload[i].size,
                }
                switch (files.imagetoupload[i].type) {
                    case 'image/jpeg':
                        v.picture = "jpeg"
                        break;
                    case 'image/png':
                        v.picture = "png"
                        break;
                    case 'text/css':
                        v.picture = "css"
                        break;
                    case 'text/html':
                        v.picture = "html"
                        break;
                    case 'text/javascript':
                        v.picture = "js"
                        break;
                    case 'text/plain':
                        v.picture = "txt"
                        break;
                    default:
                        v.picture = "directory"
                        break;
                }
                tab.push(v)
            }
            console.log(tab)
        }
        else {
            let v = {
                name: files.imagetoupload.name,
                type: files.imagetoupload.type,
                size: files.imagetoupload.size
            }

            switch (files.imagetoupload.type) {
                case 'image/jpeg':
                    v.picture = "jpeg"
                    break;
                case 'image/png':
                    v.picture = "png"
                    break;
                case 'text/css':
                    v.picture = "css"
                    break;
                case 'text/html':
                    v.picture = "html"
                    break;
                case 'text/javascript':
                    v.picture = "js"
                    break;
                case 'text/plain':
                    v.picture = "txt"
                    break;
                default:
                    v.picture = "directory"
                    break;
            }
            tab.push(v)

        }






        res.render('view1.hbs', { t: tab })

    });


});