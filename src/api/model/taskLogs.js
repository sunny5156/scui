import config from "@/config"
import http from "@/utils/request"

export default {

    taskLogs: {

        list: {
			url: `${config.API_URL}/task/log`,
			name: "获取任务日志",
			get: async function(params){
				return await http.get(this.url,params);
			}
		}

    }

}