const express = require('express')
const router = new express.Router()
const Joi = require('joi')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {v4 : uuidv4} = require('uuid')
const multer = require('multer')
const { Storage } = require('@google-cloud/storage');

const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
});

const GCLOUD_APPLICATION_CREDENTIALS = '../services/fb-key.json'
const GCLOUD_STORAGE_BUCKET_URL = 'investraitask.appspot.com'

const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: GCLOUD_APPLICATION_CREDENTIALS,
});

const bucket =
    storage.bucket(GCLOUD_STORAGE_BUCKET_URL);

router.post('/login', async(req, res) => {
    try {
        console.log(req.body)
        const schema = Joi.object({
            email: Joi.string().email().min(5).max(255).required(),
            password: Joi.string().min(5).max(1024).required(),
        })

        const result = schema.validate(req.body)
        if (result.error) return res.status(400).send({ error: result.error.details[0].message })

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send({
            status: 'error',
            message: e.message
        })
    }
})

router.post('/register', async(req, res) => {
    try {
        const schema = Joi.object({
            name: Joi.string().min(2).max(255).required(),
            email: Joi.string().email().min(5).max(255).required(),
            password: Joi.string().min(5).max(1024).required(),
        })

        const result = schema.validate(req.body)
        if (result.error) return res.status(400).send({ error: result.error.details[0].message })

        const isExist = await User.findOne({ email: req.body.email })
        if(isExist) return res.status(401).send({message: "Email id already used."})

        const user = new User({name: req.body.name, email: req.body.email, password: req.body.password})
        await user.save()
        const token = await user.generateAuthToken()

        return res.status(200).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send({
            status: 'error',
            message: e.message
        })
    }
})

router.get('/entries', auth, async (req, res) => {
    try{
        return res.send(req.user.entries)
    }catch(e){
        console.log(e)
        return res.status(400).send({message: e.message})
    }
})

router.post('/create-entry', auth, async (req, res) => {
    try{
        const schema = Joi.object({
            name: Joi.string().min(2).max(255).required(),
            about_brand: Joi.string().min(5).max(255),
            about_product: Joi.string().min(5).max(1024),
        })

        const result = schema.validate(req.body)
        if (result.error) return res.status(400).send({ error: result.error.details[0].message })

        req.user.entries.push({
            id: uuidv4(),
            name: req.body.name,
            about_brand: req.body.about_brand,
            about_product: req.body.about_product
         })

         await req.user.save()
        return res.status(201).send(req.user.entries)
    }catch(e){
        console.log(e)
        return res.status(400).send({message: e.message})
    }
})

router.post('/update-entry', auth, async (req, res) => {
    try{
        const schema = Joi.object({
            name: Joi.string().min(2).max(255).required(),
            about_brand: Joi.string().min(5).max(255),
            about_product: Joi.string().min(5).max(1024),
        })

        const result = schema.validate(req.body)
        if (result.error) return res.status(400).send({ error: result.error.details[0].message })

        req.user.entries.map((entry)=> {
            if(entry.id = req.body.id){
                entry.name = req.body.name,
                entry.about_brand = req.body.about_brand,
                entry.about_product = req.body.about_product
            }
        })

        await req.user.save()
        return res.status(200).send(req.user.entries)
    }catch(e){
        console.log(e)
        return res.status(400).send({message: e.message})
    }
})

router.post('/delete-entry', auth, async (req, res) => {
    try{
        const schema = Joi.object({
            id: Joi.string().required()
        })

        const result = schema.validate(req.body)
        if (result.error) return res.status(400).send({ error: result.error.details[0].message })

        req.user.entries = req.user.entries.filter((entry) => entry.id != req.body.id)

        await req.user.save()
        return res.status(200).send(req.user.entries)
    }catch(e){
        console.log(e)
        return res.status(400).send({message: e.message})
    }
})

router.post('/image', uploader.single('image'), async(req, res, next) => {
    try{
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        const blobWriter = blob.createWriteStream({
            metadata: {
              contentType: req.file.mimetype,
            },
          });

        blobWriter.on('error', (err) => next(err));

        blobWriter.on('finish', () => {
        
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;

        res
            .status(200)
            .send({ fileName: req.file.originalname, fileLocation: publicUrl });
        });

        blobWriter.end(req.file.buffer);
        
    }catch(e){
        console.log(e)
        return res.status(400).send(e.message)
    }
})

module.exports = router