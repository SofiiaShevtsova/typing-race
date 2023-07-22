import { Router } from 'express';
import path from 'path';
import { HTML_FILES_PATH } from '../config';
import { texts } from '../data';

const router = Router();

router.get('/', (req, res) => {
	const page = path.join(HTML_FILES_PATH, 'game.html');
	res.sendFile(page);
});

router.get('/text', (req, res) => {
	const text = texts[Math.floor(Math.random()*texts.length)]
	res.status(200).json(text);
})

export default router;
