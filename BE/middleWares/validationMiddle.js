const validation = (schema) => {
    return (req, res, next) => {
        const data = {...req.body, ...req.params, ...req.query};
        const result = schema.validate(data, { abortEarly: false });

        if (result.error) {
            const errors = result.error.details.map((detail) => detail.message);
            const err = new Error(errors.join(', '));
            err.status = 400;
            return next(err);
        }
        return next();
    }
};

export default validation;