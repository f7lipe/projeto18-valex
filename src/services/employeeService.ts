import * as employeeRepository from '../repositories/employeeRepository.js'

export async function getById(id: number) {
    console.log(id);
    const employee = await employeeRepository.findById(id);
    
    if (!employee) throw { 
        statusCode: 404, 
        type: "not_found", 
        message: "Employee not found" 
    }
    
    return employee
  }
  