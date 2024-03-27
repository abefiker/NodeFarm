class APIFeatires {
    constructor(query, modifiedQuery) {
        this.query = query;
        this.queryString = modifiedQuery;
        console.log("req.query inside APIFeatures:", modifiedQuery); 
    }
    filter() {
        const queryObj = { ...this.queryString };
        const excludeFields = ['page', 'limit', 'sort', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);
        //1B)advance filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        this.query.find(JSON.parse(queryStr));
        return this;
    }
    sorted() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(`Sorting by: ${sortBy}`); // Debugging: Log the sorting criteria
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt'); // Default sorting if none is provided
        }
        return this;
    }
    limiting() {
        if (this.queryString.fields) {
<<<<<<< HEAD
            const fields = this.queryString.fields.split(',').join(' ');
=======
            fields = this.queryString.fields.split(',').join(' ')
>>>>>>> 9cc139ff9e3639151809ea873425fd8dac6e3270
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this;
    }
    pagination() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 100
        const skipVal = (page - 1) * limit
        this.query = this.query.skip(skipVal).limit(limit)
        return this;
    }
}

module.exports = APIFeatires
