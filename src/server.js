const { express, cors, helmet } = require("./configs/importModules")
const errors = require("./configs/error")
//const middleware = require("./middleware/middleware");
const app = express()
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const ALLOWED_HEADERS = ['X-Requested-With', 'Content-Type', 'Authorization', 'x-api-key', 'x-app-version'];
const ALLOWED_ORIGINS = [];
if (process.env.ENV_NAME == "localhost" || process.env.ENV_NAME == "dev") {
    ALLOWED_ORIGINS.push('http://localhost:8000');
}

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", "data:"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'"],
            },
        },
        frameguard: { action: "sameorigin" },
        hsts: { maxAge: 31536000, includeSubDomains: true },
    })
);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Allow non-browser requests (Postman, etc.)
        if (ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ALLOWED_METHODS,
    allowedHeaders: ALLOWED_HEADERS,
    credentials: true,
    optionsSuccessStatus: 204,
};

// Use CORS middleware
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.static('public'));

app.get('/health', (req, res) => {
    res.status(200).json({
        message: 'Congratulation! Your application is running successfully'
    })
});
app.use((req, res, next) => {
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
});

// app.use(middleware.consoller);

// app.use(middleware.envVerification);
// app.use(middleware.apiKeyVerification);
// app.use(middleware.jwtVerification);

app.use("/v1/", require("./routes/router"));

//app.use(middleware.gErrorHandler);

app.use((req, res) => {
    return res.status(errors.routeNotFound.statusCode).send(errors.routeNotFound.description)
})

module.exports = app