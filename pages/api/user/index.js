import nextConnect from 'next-connect';
import middleware from '../../../middlewares/middleware';
import { extractUser } from '../../../lib/api-helpers';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary'

const upload = multer({ dest: '/tmp' });
const handler = nextConnect();

const {
    hostname: cloud_name,
    username: api_key,
    password: api_secret,
} = new URL("cloudinary://524888753825321:TNtoyCD-f65uBuLCT3Jl734brZo@ddczon2vp");

cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
});

handler.use(middleware);
handler.get(async (req, res) => res.json({ user: extractUser(req) }));

handler.patch(upload.single('profilePicture'), async (req, res) => {
    if (!req.user) {
        req.status(401).end();
        return;
    }

    let profilePicture;
    if (req.file) {
        const image = await cloudinary.uploader.upload(req.file.path, {
            width: 512,
            height: 512,
            crop: 'fill',
            folder: 'Nextjs-Mongodb-Authentication-App',
            use_filename: true
        });
        profilePicture = image.secure_url;
    }

    const { name, bio } = req.body;

    await req.db.collection('users').updateOne(
        { _id: req.user._id },
        {
            $set: {
                name: name,
                bio: bio,
                ...(profilePicture && { profilePicture })
            },
        },
    );
    res.json({ user: { name, bio } });
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler;