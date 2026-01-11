
// Mock API with fake data and delay to simulate network requests

const MOCK_NOMENCLATURES = [
    {
        id: "nom_1",
        name: "Отдел",
        uniqueCode: "DEPARTMENT",
        description: "Списък на отдели/ дирекции в банката.",
        totalValues: 21,
        isActive: true,
        createdBy: "admin",
        createdAt: new Date('2025-01-01'),
        values: [
            { id: 1, nomenclatureId: "nom_1", name: "Съответствие", uniqueCode: "DEPT_COMPLIANCE", sortOrder: 1, isActive: true, usageCount: 0 },
            { id: 2, nomenclatureId: "nom_1", name: "Методология", uniqueCode: "DEPT_METHODOLOGY", sortOrder: 2, isActive: true, usageCount: 0 },
            { id: 3, nomenclatureId: "nom_1", name: "Вътрешнобанков одит", uniqueCode: "DEPT_INTERNAL_AUDIT", sortOrder: 3, isActive: true, usageCount: 2 },
            { id: 4, nomenclatureId: "nom_1", name: "Правна", uniqueCode: "DEPT_LEGAL", sortOrder: 4, isActive: true, usageCount: 0 },
            { id: 5, nomenclatureId: "nom_1", name: "GDPR", uniqueCode: "DEPT_GDPR", sortOrder: 5, isActive: true, usageCount: 1 },
            { id: 6, nomenclatureId: "nom_1", name: "Маркетинг, ПР и реклама", uniqueCode: "DEPT_MARKETING_PR", sortOrder: 6, isActive: true, usageCount: 0 },
            { id: 7, nomenclatureId: "nom_1", name: "Корпоративно банкиране", uniqueCode: "DEPT_CORPORATE_BANKING", sortOrder: 7, isActive: true, usageCount: 0 },
            { id: 8, nomenclatureId: "nom_1", name: "Пазари и ликвидност", uniqueCode: "DEPT_MARKETS_LIQUIDITY", sortOrder: 8, isActive: true, usageCount: 0 },
            { id: 9, nomenclatureId: "nom_1", name: "Банкиране на дребно", uniqueCode: "DEPT_RETAIL_BANKING", sortOrder: 9, isActive: true, usageCount: 0 },
            { id: 10, nomenclatureId: "nom_1", name: "Управление на клонова мрежа", uniqueCode: "DEPT_BRANCH_NETWORK", sortOrder: 10, isActive: true, usageCount: 3 },
            { id: 11, nomenclatureId: "nom_1", name: "Кредитиране на микро и малки предприятия", uniqueCode: "DEPT_SME_LENDING", sortOrder: 11, isActive: true, usageCount: 1 },
            { id: 12, nomenclatureId: "nom_1", name: "Операции", uniqueCode: "DEPT_OPERATIONS", sortOrder: 12, isActive: true, usageCount: 0 },
            { id: 13, nomenclatureId: "nom_1", name: "Информационни технологии", uniqueCode: "DEPT_IT", sortOrder: 13, isActive: true, usageCount: 5 },
            { id: 14, nomenclatureId: "nom_1", name: "Сигурност", uniqueCode: "DEPT_SECURITY", sortOrder: 14, isActive: true, usageCount: 0 },
            { id: 15, nomenclatureId: "nom_1", name: "Риск", uniqueCode: "DEPT_RISK", sortOrder: 15, isActive: true, usageCount: 0 },
            { id: 16, nomenclatureId: "nom_1", name: "Картов център", uniqueCode: "DEPT_CARD_CENTER", sortOrder: 16, isActive: true, usageCount: 0 },
            { id: 17, nomenclatureId: "nom_1", name: "Необслужвани и преструктурирани експозиции", uniqueCode: "DEPT_NPL", sortOrder: 17, isActive: true, usageCount: 0 },
            { id: 18, nomenclatureId: "nom_1", name: "Управление на човешките ресурси", uniqueCode: "DEPT_HR", sortOrder: 18, isActive: true, usageCount: 4 },
            { id: 19, nomenclatureId: "nom_1", name: "Финансово - счетоводна", uniqueCode: "DEPT_FINANCE_ACCOUNTING", sortOrder: 19, isActive: true, usageCount: 0 },
            { id: 20, nomenclatureId: "nom_1", name: "Информационна сигурност", uniqueCode: "DEPT_INFO_SECURITY", sortOrder: 20, isActive: true, usageCount: 0 },
            { id: 21, nomenclatureId: "nom_1", name: "Дигитално развитие", uniqueCode: "DEPT_DIGITAL_DEVELOPMENT", sortOrder: 21, isActive: true, usageCount: 2 }
        ]
    },
    {
        id: "nom_2",
        name: "Категория",
        uniqueCode: "COURSE_CATEGORY",
        description: "Категория на обучения",
        totalValues: 8,
        isActive: true,
        createdBy: "admin",
        createdAt: new Date('2025-01-01'),
        values: [
            { id: 0, nomenclatureId: "nom_2", name: "Плащания", uniqueCode: "CAT_PAYMENTS", sortOrder: 1, isActive: true, usageCount: 0 },
            { id: 1, nomenclatureId: "nom_2", name: "Кредити", uniqueCode: "CAT_LOANS", sortOrder: 2, isActive: true, usageCount: 1 },
            { id: 2, nomenclatureId: "nom_2", name: "Сметки и депозити", uniqueCode: "CAT_ACCOUNTS_DEPOSITS", sortOrder: 3, isActive: true, usageCount: 0 },
            { id: 3, nomenclatureId: "nom_2", name: "GDPR", uniqueCode: "CAT_GDPR", sortOrder: 4, isActive: true, usageCount: 1 },
            { id: 4, nomenclatureId: "nom_2", name: "Карти", uniqueCode: "CAT_CARDS", sortOrder: 5, isActive: true, usageCount: 0 },
            { id: 5, nomenclatureId: "nom_2", name: "Сигурност", uniqueCode: "CAT_SECURITY", sortOrder: 6, isActive: true, usageCount: 0 },
            { id: 6, nomenclatureId: "nom_2", name: "AML", uniqueCode: "CAT_AML", sortOrder: 7, isActive: true, usageCount: 1 },
            { id: 7, nomenclatureId: "nom_2", name: "Дигитализация", uniqueCode: "CAT_DIGITALIZATION", sortOrder: 8, isActive: true, usageCount: 1 }
        ]
    }
];

let MOCK_SURVEYS = [
    {
        id: "s_001",
        courseId: "c_002",
        courseTitle: "GDPR Basics (Тест 2)",
        dueDate: "2026-02-01",
        status: "pending",
        sections: [
            { title: "ТЕМА", criteria: [{ id: "t_1", label: "Актуалност" }, { id: "t_2", label: "Изчерпателност" }, { id: "t_3", label: "Практическа приложимост" }] },
            { title: "ЛЕКТОРСКИ ЕКИП", criteria: [{ id: "l_1", label: "Представяне на темата" }, { id: "l_2", label: "Преподавателски умения" }, { id: "l_3", label: "Иновативен подход" }] },
            { title: "МАТЕРИАЛИ", criteria: [{ id: "m_1", label: "Актуалност" }, { id: "m_2", label: "Достатъчност" }] }
        ]
    }
];

const MOCK_USER = { uid: "user_123", email: "sslavcheva@municipalbank.bg", displayName: "Силвия Славчева", role: "admin", department: "Администрация" };

const MOCK_COURSES = [
    {
        id: "c_003",
        title: "Тест 3",
        category: "Кредити",
        mandatory: true,
        progress: 0,
        totalModules: 10,
        thumbnail: "https://images.unsplash.com/photo-1554224155-9736b5cb9336?w=600&auto=format&fit=crop&q=60",
        duration: "30 мин",
        modules: [
            { id: "m3_1", title: "Въведение в Кредитирането", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "10:00", completed: false },
            {
                id: "m3_2",
                title: "Тест: Кредити",
                type: "quiz",
                completed: false,
                questions: [
                    {
                        id: "q1",
                        text: "Какво е кредит?",
                        options: [
                            { id: "o1", text: "Пари на заем" },
                            { id: "o2", text: "Подарък" }
                        ],
                        correctAnswer: "o1"
                    },
                    {
                        id: "q2",
                        text: "Кой отпуска кредит?",
                        options: [
                            { id: "o1", text: "Банка" },
                            { id: "o2", text: "Съсед" }
                        ],
                        correctAnswer: "o1"
                    }
                ]
            }
        ]
    },
    {
        id: "c_002",
        title: "Тест 2",
        category: "GDPR",
        mandatory: true,
        progress: 0,
        totalModules: 10,
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60",
        duration: "30 мин",
        modules: [
            { id: "m2_1", title: "Основи на GDPR", type: "video", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "15:00", completed: false }
        ]
    },
    {
        id: "c_compliance_001",
        title: "AML: Противодействие на изпирането на пари (2026)",
        category: "AML",
        mandatory: true,
        progress: 0,
        totalModules: 3,
        thumbnail: "https://plus.unsplash.com/premium_photo-1661414415246-3e502e2fb241?q=80&w=600&auto=format&fit=crop",
        duration: "45 мин",
        mode: "compliance",
        settings: {
            sequentialEnforcement: true,
            resetOnFailure: true,
            maxQuizAttempts: 2
        },
        modules: [
            {
                id: "m_aml_1",
                title: "Въведение в AML (Презентация)",
                type: "presentation",
                completed: false,
                status: "unlocked",
                slides: [
                    { id: "s1", content: "Добре дошли в курса по AML...", minTime: 5 },
                    { id: "s2", content: "Основни понятия и дефиниции...", minTime: 5 },
                    { id: "s3", content: "Законодателна рамка...", minTime: 5 }
                ]
            },
            {
                id: "m_aml_2",
                title: "Типологии (Видео)",
                type: "video",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                duration: "10:00",
                completed: false,
                status: "locked",
                settings: {
                    minWatchThreshold: 0.9, // 90%
                    allowSeekForward: false
                }
            },
            {
                id: "m_aml_3",
                title: "Финален Тест",
                type: "quiz",
                completed: false,
                status: "locked",
                questions: [
                    { id: "q1", text: "Какво е пране на пари?", options: [{ id: "a", text: "Процес на узаконяване" }, { id: "b", text: "Химическо чистене" }], correctAnswer: "a" },
                    { id: "q2", text: "Кой носи отговорност?", options: [{ id: "a", text: "Само директора" }, { id: "b", text: "Всеки служител" }], correctAnswer: "b" }
                ]
            }
        ]
    }
];

const MOCK_STATS = { started: 2, completed: 1, surveys: 1, pending: 0, overdue: 0, certificates: 0 };
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
    login: async (email, password) => { await delay(500); if (email === "fail@error.com") throw new Error("Грешни данни"); return MOCK_USER; },
    getCourses: async () => { await delay(500); return MOCK_COURSES; },
    getStats: async () => { await delay(500); return MOCK_STATS; },
    getCourseDetails: async (id) => { await delay(500); return MOCK_COURSES.find(c => c.id === id) || MOCK_COURSES[0]; },
    submitQuiz: async (cId, mId, score) => { await delay(800); return { success: true, passed: score >= 50 }; },
    getSurveys: async () => { await delay(500); return MOCK_SURVEYS; },
    submitSurvey: async (surveyId, answers) => {
        await delay(800);
        const index = MOCK_SURVEYS.findIndex(s => s.id === surveyId);
        if (index !== -1) { MOCK_SURVEYS[index].status = "completed"; }
        return { success: true };
    },
    updateCourseProgress: async (courseId, progress) => {
        await delay(300);
        const course = MOCK_COURSES.find(c => c.id === courseId);
        if (course) {
            course.progress = progress;
        }
        return { success: true };
    },
    createCourse: async (courseData) => {
        await delay(800);
        const newCourse = {
            id: `c_${Date.now()}`,
            ...courseData,
            progress: 0,
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60'
        };
        MOCK_COURSES.push(newCourse);
        return { success: true, data: newCourse };
    },
    updateCourse: async (id, courseData) => {
        await delay(800);
        const index = MOCK_COURSES.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Обучението не е намерено');
        MOCK_COURSES[index] = { ...MOCK_COURSES[index], ...courseData };
        return { success: true, data: MOCK_COURSES[index] };
    },
    deleteCourse: async (id) => {
        await delay(500);
        const index = MOCK_COURSES.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Обучението не е намерено');
        MOCK_COURSES.splice(index, 1);
        return { success: true };
    },
    getUsers: async () => {
        await delay(600);
        return [
            { id: 1, name: 'Иван Иванов', email: 'i.ivanov@municipalbank.bg', role: 'trainee', department: 'ИТ Отдел', status: 'active', lastLogin: '2026-01-10' },
            { id: 2, name: 'Мария Петрова', email: 'm.petrova@municipalbank.bg', role: 'manager', department: 'Човешки ресурси', status: 'active', lastLogin: '2026-01-11' },
            { id: 3, name: 'Георги Георгиев', email: 'g.georgiev@municipalbank.bg', role: 'trainee', department: 'Клонова мрежа', status: 'inactive', lastLogin: '2025-12-15' },
            { id: 4, name: 'Елена Димитрова', email: 'e.dimitrova@municipalbank.bg', role: 'hr_admin', department: 'Човешки ресурси', status: 'active', lastLogin: '2026-01-11' },
            { id: 5, name: 'Стефан Колев', email: 's.kolev@municipalbank.bg', role: 'trainee', department: 'ИТ Отдел', status: 'active', lastLogin: '2026-01-09' }
        ];
    },
    getAnalytics: async () => {
        await delay(700);
        return {
            overallCompletion: 78,
            activeUsers: 145,
            averageScore: 85,
            coursesByStatus: [
                { name: 'Завършени', value: 450, color: '#10B981' },
                { name: 'В процес', value: 210, color: '#F59E0B' },
                { name: 'Незапочнати', value: 120, color: '#EF4444' }
            ],
            topCourses: [
                { name: 'GDPR 2026', completions: 85 },
                { name: 'AML Процедури', completions: 72 },
                { name: 'Киберсигурност', completions: 68 }
            ],
            monthlyActivity: [
                { month: 'Сеп', count: 45 },
                { month: 'Окт', count: 52 },
                { month: 'Ное', count: 48 },
                { month: 'Дек', count: 70 },
                { month: 'Яну', count: 65 }
            ]
        };
    },
    getNomenclatures: async () => { await delay(500); return MOCK_NOMENCLATURES; },

    // Nomenclature CRUD Operations
    createNomenclature: async (data) => {
        await delay(500);
        // Validate uniqueCode
        const exists = MOCK_NOMENCLATURES.find(n => n.code === data.uniqueCode);
        if (exists) {
            throw new Error(`Кодът "${data.uniqueCode}" вече съществува`);
        }
        const newNom = {
            id: `nom_${Date.now()}`,
            ...data,
            createdAt: new Date(),
            values: []
        };
        MOCK_NOMENCLATURES.push(newNom);
        return { success: true, data: newNom };
    },

    updateNomenclature: async (id, data) => {
        await delay(500);
        const index = MOCK_NOMENCLATURES.findIndex(n => n.id === id);
        if (index === -1) throw new Error('Номенклатурата не е намерена');

        // Check uniqueCode duplication
        if (data.uniqueCode) {
            const exists = MOCK_NOMENCLATURES.find(n => n.code === data.uniqueCode && n.id !== id);
            if (exists) throw new Error(`Кодът "${data.uniqueCode}" вече съществува`);
        }

        MOCK_NOMENCLATURES[index] = { ...MOCK_NOMENCLATURES[index], ...data };
        return { success: true, data: MOCK_NOMENCLATURES[index] };
    },

    deleteNomenclature: async (id) => {
        await delay(500);
        const index = MOCK_NOMENCLATURES.findIndex(n => n.id === id);
        if (index === -1) throw new Error('Номенклатурата не е намерена');

        // Soft delete
        MOCK_NOMENCLATURES[index].isActive = false;
        MOCK_NOMENCLATURES[index].values.forEach(v => v.isActive = false);

        return { success: true };
    },

    // Nomenclature Value CRUD Operations
    createNomenclatureValue: async (nomenclatureId, data) => {
        await delay(500);
        const nom = MOCK_NOMENCLATURES.find(n => n.id === nomenclatureId);
        if (!nom) throw new Error('Номенклатурата не е намерена');

        // Validate uniqueCode globally
        const allValues = MOCK_NOMENCLATURES.flatMap(n => n.values);
        const exists = allValues.find(v => v.uniqueCode === data.uniqueCode);
        if (exists) throw new Error(`Кодът "${data.uniqueCode}" вече съществува`);

        const newValue = {
            id: `val_${Date.now()}`,
            nomenclatureId,
            ...data,
            sortOrder: nom.values.length + 1,
            usageCount: 0,
            isActive: true,
            createdAt: new Date()
        };

        nom.values.push(newValue);
        return { success: true, data: newValue };
    },

    updateNomenclatureValue: async (nomenclatureId, valueId, data) => {
        await delay(500);
        const nom = MOCK_NOMENCLATURES.find(n => n.id === nomenclatureId);
        if (!nom) throw new Error('Номенклатурата не е намерена');

        const valueIndex = nom.values.findIndex(v => v.id === valueId);
        if (valueIndex === -1) throw new Error('Стойността не е намерена');

        // Check uniqueCode if changed
        if (data.uniqueCode && data.uniqueCode !== nom.values[valueIndex].uniqueCode) {
            const allValues = MOCK_NOMENCLATURES.flatMap(n => n.values);
            const exists = allValues.find(v => v.uniqueCode === data.uniqueCode && v.id !== valueId);
            if (exists) throw new Error(`Кодът "${data.uniqueCode}" вече съществува`);
        }

        nom.values[valueIndex] = { ...nom.values[valueIndex], ...data };
        return { success: true, data: nom.values[valueIndex] };
    },

    deleteNomenclatureValue: async (nomenclatureId, valueId) => {
        await delay(500);
        const nom = MOCK_NOMENCLATURES.find(n => n.id === nomenclatureId);
        if (!nom) throw new Error('Номенклатурата не е намерена');

        const value = nom.values.find(v => v.id === valueId);
        if (!value) throw new Error('Стойността не е намерена');

        // Check usage count
        if (value.usageCount > 0) {
            throw new Error(`Не може да се изтрие. Използва се в ${value.usageCount} записа.`);
        }

        // Soft delete
        value.isActive = false;
        return { success: true };
    }
};
