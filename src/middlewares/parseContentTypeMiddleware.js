const express = require('express');


const parseContentTypeMiddleware = async(req, res, next) => {

    const contentType = req.headers['content-type'];

    console.log("content-type", contentType);

    if (!contentType) {
        return next();
    }

    if (contentType.includes('application/json')) {
        return express.json()(req, res, next);
    }

    if (contentType.includes('application/xml')) {
        //return xmlParser()(req, res, next); // Utiliza el middleware de análisis de XML
    }

    if (contentType.includes('application/x-www-form-urlencoded')) {
        return express.urlencoded({ extended: true })(req, res, next);
    }

    if (contentType.includes('multipart/form-data')) {
        // Utiliza el middleware Multer para manejar archivos
        
    }

    // Si no coincide con ninguno de los tipos anteriores, maneja según tus necesidades
    return next();

};



module.exports = parseContentTypeMiddleware;
