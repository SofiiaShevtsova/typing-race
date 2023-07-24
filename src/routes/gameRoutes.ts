import { Router } from 'express';
import path from 'path';
import { HTML_FILES_PATH } from '../config';
import { texts } from '../data';

const router = Router();

router.get('/', (req, res) => {
	const page: string = path.join(HTML_FILES_PATH, 'game.html');
	res.sendFile(page);
});

router.get('/text/:id', (req, res) => {
	const { id }:{id:string} = req.params
	const text: string = texts[+id]
	
	res.status(200).json(text);
})

export default router;
