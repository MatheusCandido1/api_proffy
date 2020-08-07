import { Request, Response} from 'express'

import db from '../database/connection';
import convertHourToMinutues from '../utils/convertHourToMinutes';

interface ScheduleItem{
    week_day: number,
    from: string,
    to: string
}

export default class ClassesController {
    async create (request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        const trx = await db.transaction();
    
        try {
            const createdUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            });
        
            const user_id = createdUsersIds[0];
        
            const createdClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id
            });
        
            const class_id = createdClassesIds[0];
        
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutues(scheduleItem.from),
                    to: convertHourToMinutues(scheduleItem.to)
                };
            })
        
            await trx('class_schedule').insert(classSchedule);
        
            await trx.commit();
        
            return response.status(201).send();
            
        } catch (err) {
            await trx.rollback();
            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            })
        }
        
        
    }
}