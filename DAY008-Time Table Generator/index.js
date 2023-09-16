async function main() {

    let breakStartTime = new Date()
    let breakEndTime = new Date()
    const breakTimeArray = [
        {
            start: new Date(breakStartTime.setHours(10, 0, 0, 0)),
            end: new Date(breakEndTime.setHours(12, 0, 0, 0))
        },
        {
            start: new Date(breakStartTime.setHours(14, 0, 0, 0)),
            end: new Date(breakEndTime.setHours(15, 0, 0, 0))
        }
    ]

    function getTimeSlots(duration, interval=0) {
    
        let periodArray = [];
    
        let startTime = new Date();
        let endTime = new Date();
    
        startTime.setHours(8, 0, 0, 0)
        endTime.setHours(20, 0, 0, 0)
    
        while(startTime < endTime){
            let start;
            let end;
        
            start = new Date(startTime.getTime());
            end = new Date(startTime.getTime() + duration * 60 * 1000);
    
            periodArray.push({
                startTime: start,
                endTime: end,
                start: start.toTimeString(),
                end: end.toTimeString(),
                isDisabled: false
            })
    
            startTime = new Date(end);
        }
    
          const timeSlots = periodArray.map(slot=> {
            return {
                ...slot,
                start: (slot.start.split(' ')[0]).slice(0,5),
                end: (slot.end.split(' ')[0]).slice(0,5)
            }
        })

        return timeSlots
    }

    const slots = getTimeSlots(30)

    async function disableConflictTimes(breakTimeArray, slots) {

        const slotsArray= slots.map(async slot=> {
            let isDisabled = false;
            const breakTimeArrayOutPut = breakTimeArray.map( async block=>{
                if(
                    (slot.startTime <= block.start && slot.endTime > block.start) ||
                    (slot.startTime < block.end && slot.endTime >= block.end) ||
                    (slot.startTime >= block.start && slot.endTime <= block.end)
                ){
                   isDisabled = true;
                }
            })

            await Promise.all(breakTimeArrayOutPut);

            return {
                ...slot,
                isDisabled
            }
        })

        return await Promise.all(slotsArray);
    }

    

    const output = await disableConflictTimes(breakTimeArray, slots)

    // if(slots[0].startTime < breakTimeArray[0].start){
    //     console.log(true)
    // }else{
    //     console.log(false)
    // }

    console.log(output)


}

main();