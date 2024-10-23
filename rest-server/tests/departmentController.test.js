import request from 'supertest';
import express from 'express';
import router from '../route.js';
import Department from '../models/Department';

const app = express();
app.use(router);

// Mock middleware
// jest.mock('../middleware/authMiddleware.js', () => ({
//     isStudentOrLecturer: (req, res, next) => next(),
// }));

describe('DepartmentController', () => {
    describe('GET /department/:id', () => {
        it('should return department details for the given ID', async () => {
            const departmentData = {
                _id: '123',
                "namaDepartment": "Fakultas Teknologi Informasi",
                "deskripsi": "Fakultas Teknologi Informasi adalah entitas akademik yang fokus pada penyelenggaraan pendidikan tinggi di bidang teknologi informasi. Menawarkan program-program studi yang komprehensif untuk membekali mahasiswa dengan pengetahuan dan keterampilan terkini dalam dunia teknologi. Berkomitmen untuk menciptakan lingkungan akademis yang inovatif dan berorientasi pada perkembangan teknologi.",
                "kepalaDepartmentId": "65be746dc0ec1c89af854bb5"
            };
            jest.spyOn(Department, 'findById').mockResolvedValue(departmentData);

            const res = await request(app).get('/department/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(departmentData);
        });

        it('should return 404 if department not found', async () => {
            jest.spyOn(Department, 'findById').mockResolvedValue(null);

            const res = await request(app).get('/department/123');

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Department not found.');
        });

        it('should return 500 if there is a server error', async () => {
            jest.spyOn(Department, 'findById').mockRejectedValue(new Error('Server error'));

            const res = await request(app).get('/department/123');

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Server error');
        });
    });

    describe('GET /department/lecturer/:id', () => {
        it('should return department details for the given lecturer ID', async () => {
            const departmentData = {
                _id: '123',
                "namaDepartment": "Fakultas Teknologi Informasi",
                "deskripsi": "Fakultas Teknologi Informasi adalah entitas akademik yang fokus pada penyelenggaraan pendidikan tinggi di bidang teknologi informasi. Menawarkan program-program studi yang komprehensif untuk membekali mahasiswa dengan pengetahuan dan keterampilan terkini dalam dunia teknologi. Berkomitmen untuk menciptakan lingkungan akademis yang inovatif dan berorientasi pada perkembangan teknologi.",
                "kepalaDepartmentId": "65be746dc0ec1c89af854bb5"
            };
            jest.spyOn(Department, 'find').mockResolvedValue(departmentData);

            const res = await request(app).get('/department/lecturer/lecturerId');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(departmentData);
        });

        it('should return 404 if no department is found for the lecturer ID', async () => {
            jest.spyOn(Department, 'find').mockResolvedValue([]);

            const res = await request(app).get('/department/lecturer/lecturerId');

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Department not found.');
        });

        it('should return 500 if there is a server error', async () => {
            jest.spyOn(Department, 'find').mockRejectedValue(new Error('Server error'));

            const res = await request(app).get('/department/lecturer/lecturerId');

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Server error');
        });
    });

    describe('POST /department', () => {
        it('should save a new department and return it', async () => {
            const departmentData = {
                _id: '123',
                "namaDepartment": "Fakultas Teknologi Informasi",
                "deskripsi": "Fakultas Teknologi Informasi adalah entitas akademik yang fokus pada penyelenggaraan pendidikan tinggi di bidang teknologi informasi. Menawarkan program-program studi yang komprehensif untuk membekali mahasiswa dengan pengetahuan dan keterampilan terkini dalam dunia teknologi. Berkomitmen untuk menciptakan lingkungan akademis yang inovatif dan berorientasi pada perkembangan teknologi.",
                "kepalaDepartmentId": "65be746dc0ec1c89af854bb5"
            };
            jest.spyOn(Department, 'insertMany').mockResolvedValue([departmentData]);

            const res = await request(app)
                .post('/department')
                .send(departmentData);

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual([departmentData]);
        });

        it('should return 400 if there is a validation error', async () => {
            jest.spyOn(Department, 'insertMany').mockRejectedValue(new Error('Validation error'));

            const res = await request(app)
                .post('/department')
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Validation error');
        });
    });
});
