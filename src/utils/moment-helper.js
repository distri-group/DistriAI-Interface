const moment = require("moment");

module.exports ={
    rangeName:rangeName,
    rangeDate:rangeDate
};

function rangeName() {
    return [
        {name:'今天',v:'today'},
        {name:'昨天',v:'yesterday'},
        {name:'前天',v:'yesterday2'},
        {name:'大前天',v:'yesterday3'},
        {name:'本周',v:'this-week'},
        {name:'上周',v:'lasy-week'},
        {name:'本月',v:'this-month'},
        {name:'上个月',v:'lasy-month'},
        {name:'本季度',v:'this-quarter'},
        {name:'上季度',v:'lasy-quarter'},
        {name:'今年',v:'this-year'},
        {name:'去年',v:'lasy-year'},
    ];
}
function rangeDate(name, n) {
    let now = n || moment();
    let start=0, end = now.clone(),month=0,month2=0,quarter=0;
    switch (name) {
        case 'today'://今天
            start = now.clone();
            break;
        case 'this-week'://本周
            start = now.clone().subtract(now.clone().weekday(), 'days');
            break;
        case 'this-month'://本月
            start = moment({y: now.clone().year(), M: now.clone().month(), d: 1});
            break;
        case 'this-quarter'://本季度
            quarter = now.clone().quarter();
            month = 7;
            if (quarter == 1) {
                month = 10;
            }
            else if (quarter == 2) {
                month = 1;
            }
            else if (quarter == 3) {
                month = 4;
            }
            start = moment({y: now.clone().year(), M: month, d: 1});
            break;
        case 'this-year'://今年
            start = moment({y: now.clone().year(), M: 0, d: 1});
            break;
        case 'yesterday'://昨天
            start = now.clone().subtract(1,'days');
            end =start.clone();
            break;
        case 'lasy-week'://上周
            start = now.clone().subtract(now.clone().weekday()+7, 'days');
            end = now.clone().subtract(now.clone().weekday()+1, 'days');
            break;
        case 'lasy-month'://上个月
            start = moment({y: now.clone().year(), M: now.clone().month()-1, d: 1});
            end = moment({y: now.clone().year(), M: now.clone().month(), d: 1}).subtract(1,'days');
            break;
        case 'lasy-quarter'://上个季度
            quarter = now.clone().quarter();
            month = 7;
            if (quarter == 1) {
                month = 10;
            }
            else if (quarter == 2) {
                month = 1;
            }
            else if (quarter == 3) {
                month = 4;
            }
            month2=month-3;
            if(month2<0){
                month2=10;
            }
            start = moment({y: now.clone().year(), M: month2, d: 1});
            end = moment({y: now.clone().year(), M: month, d: 1}).subtract(1,'days');
            break;
        case 'lasy-year'://去年
            start = moment({y: now.clone().year()-1, M: 0, d: 1});
            end = moment({y: now.clone().year(), M: 0, d: 1}).subtract(1,'days');
            break;
        case 'yesterday2'://前天
            start = now.clone().subtract(2,'days');
            end = start.clone();
            break;
        case 'yesterday3'://大前天
            start = now.clone().subtract(3,'days');
            end = start.clone();
            break;
    }
    return {start: start.format('YYYY-MM-DD 0:0:0'), end: end.format('YYYY-MM-DD 23:59:59')}
}


// let arr=['today','this-week','this-month','this-quarter','this-year','yesterday','lasy-week','lasy-month','lasy-quarter','lasy-year','yesterday2','yesterday3'];
// let now0=moment();
// let now1=moment('2018-1-25 3:2:1','YYYY-MM-DD HH:mm:ss');
// let now2=moment('2018-2-7 3:2:1','YYYY-MM-DD HH:mm:ss');
// let now3=moment('2018-9-5 3:2:1','YYYY-MM-DD HH:mm:ss');
// let now4=moment('2018-11-30 3:2:1','YYYY-MM-DD HH:mm:ss');
// let nowArr=[now0,now1,now2,now3,now4];
// nowArr.forEach(n=>{
//     console.log('********',n.format('YYYY-MM-DD HH:mm:ss'),'*********');
//     arr.forEach(t=>{
//         console.log(getDateRange(t,n),t);
//     });
// });
