import * as employeeRepository from '../repositories/employeeRepository.js'

export async function getEmplpyeeById(id: number) {

    const employee = await employeeRepository.findById(id);
    
    if (!employee) throw { 
        statusCode: 404, 
        type: "not_found", 
        message: "Employee not found" 
    }
    
    return employee
  }
  