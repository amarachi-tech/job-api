const Job = require("../models/Job")
const {StatusCodes} = require("http-status-codes")
const {BadRequestError, NotFoundError} = require("../errors")

const getAllJobs = async(req, res) =>{
    const jobs = await Job.find({createdBy:req.user.userId}).sort("createdAt")
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const getJob = async(req, res) =>{
    const {user:{userId}, params:{id:jobId}}= req
    const job = await Job.findOne({
        _id:jobId, createdBy:userId
    })

    if(!job){
        throw new NotFoundError(`No job with ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const createJob = async(req, res) =>{
    req.body.createdBy = req.user.userId
    const jobs = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({jobs})
}
const updateJob = async(req, res) =>{
    const {
        body:{company, position},
        user:{userId},
        params:{id:jobId}
    } = req
    //check if the position or company are empty, if yes, throw error
    if(company === "" || position === ""){
        throw new BadRequestError("company and position most not be empty")
    }
    const job = await Job.findOneAndUpdate({
        _id:jobId, createdBy:userId
    }, req.body, {new:true, runValidators:true})
    if(!job){
        throw new NotFoundError(`No job with ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const deleteJob = async(req, res) =>{
    const {
        user:{userId},
        params:{id:jobId}
    } = req
    const job = await Job.findOneAndDelete({_id:jobId, createdBy:userId})
    if(!job){
        throw new BadRequestError(`No user with ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}
