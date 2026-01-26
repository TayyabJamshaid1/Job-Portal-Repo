 import { Connection } from "mongoose";
//next js me database ki connectivity k 3 scenarios huty ha
// a) database is connected   b)database is not connected c)Connection request has been gone ,in this case promise will be returned
//below we will make global variable and handle all scenarios,global ko export krny ki zrort ha,global ap k node k ecosystem already avaiable huta ha,agr ap ny global me mazid values dni hu tu isko un new values k sath srf declare krna huta ha (simply hum node ko keh rhy huty ha k tmhary pas already global me kuch values hu gi,mazid ye values b ly lo)
 declare global{
    var mongoose:{
        conn:Connection|null; //here handle 2 scenarios(if connected then Connection will be assigned,if not,null will be assigned)
        promise:Promise<Connection>|null;//if connection request has been gone,then Promise of type Connection will be assigned
    }
 }
 export {} 