<!--
 * @Descripttion: 详情列表模板
 * @version: 1.1
 * @Author: sakuya
 * @Date: 2021年6月16日15:05:15
 * @LastEditors: sakuya
 * @LastEditTime: 2021年7月22日12:18:50
-->

<template>
	<el-container>
		<el-header style="display: block;height:auto;">
			<el-row :gutter="15">
				<el-col :lg="6">
					<sc-statistic title="数量" value="12"  suffix="项"></sc-statistic>
				</el-col>
				<el-col :lg="6">
					<sc-statistic title="总进度" value="70.0" suffix="%"></sc-statistic>
				</el-col>
				<el-col :lg="6">
					<sc-statistic title="收入" value="0.0" prefix="¥" groupSeparator></sc-statistic>
				</el-col>
				<el-col :lg="6">
					<sc-statistic title="支出" value="200" prefix="¥" groupSeparator></sc-statistic>
				</el-col>
			</el-row>
		</el-header>
		<el-header class="header-tabs">
			<el-tabs type="border-card">
				<el-tab-pane label="所有"></el-tab-pane>
				<el-tab-pane label="未完成 (2)"></el-tab-pane>
				<el-tab-pane label="弃坑"></el-tab-pane>
				<el-tab-pane label="其他"></el-tab-pane>
			</el-tabs>
		</el-header>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button v-if="selection.length>0" type="danger" plain icon="el-icon-delete"></el-button>
				<el-button v-if="selection.length>0">变更状态</el-button>
				<el-button v-if="selection.length>0">推送至队列</el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<scFilterBar :options="options" @change="change"></scFilterBar>
				</div>

				<div class="right-panel-search">
					<el-input v-model="search.task_id" placeholder="任务ID" clearable></el-input>
					<el-select v-model="search.status" clearable>
						<el-option label="失败" :value="1"></el-option>
						<el-option label="执行中" :value="2"></el-option>
						<el-option label="成功" :value="3"></el-option>
						<el-option label="取消" :value="4"></el-option>
					</el-select>
					<el-button type="primary" icon="el-icon-search" @click="upSearch"></el-button>
				</div>

			</div>

			
		</el-header>
		<el-main class="nopadding">
			<scTable tableName="templateList" ref="table" :apiObj="apiObj"  :dataTotal=90  :getPaginationData="getData" :column="column" @selection-change="selectionChange" stripe>

				<!-- 各列自定义template -->
				<!-- <template #state="scope">
					<sc-status-indicator v-if="scope.row.state=='1'" type="primary"></sc-status-indicator>
					<sc-status-indicator v-if="scope.row.state=='2'" pulse type="danger"></sc-status-indicator>
				</template>
				<template #name="scope">
					<h4>{{scope.row.name}}</h4>
					<p>{{scope.row.subtitle}}</p>
				</template>
				<template #type="scope">
					<el-tag>{{scope.row.type}}</el-tag>
				</template>
				<template #progress="scope">
					<el-progress v-if="scope.row.state=='1'" :percentage="scope.row.progress"></el-progress>
					<el-progress v-if="scope.row.state=='2'" :percentage="scope.row.progress" status="exception"></el-progress>
				</template> -->

				<!-- 固定列-选择列 -->
				<el-table-column type="selection" width="50" fixed></el-table-column>

				<!-- 固定列-操作列 -->
				<el-table-column label="操作" fixed="right" align="right" width="120">
					<template #default="scope">
						<el-button type="text" size="small" @click="table_show(scope.row, scope.$index)">执行结果</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-dropdown>
							<el-button  type="text" size="small">更多<el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon></el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="table_edit(scope.row, scope.$index)">编辑</el-dropdown-item>
									<el-dropdown-item>推送至队列</el-dropdown-item>
									<el-dropdown-item divided>删除</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
				</el-table-column>

			</scTable>
		</el-main>
	</el-container>

	<el-drawer v-model="info"  :size="800"  custom-class="drawerBG" direction="rtl" destroy-on-close >
		<info :detailObj="detail" ></info>
	</el-drawer>

</template>

<script>
	import scStatistic from '@/components/scStatistic';
	import scFilterBar from '@/components/scFilterBar';
	import info from './info'
	// import scTable from '@/components/scTable'

	export default {
		name: 'list',
		components: {
			scStatistic,
			scFilterBar,
			info,
			// scTable
		},
		data() {
			return {
				info: false,
				// options: [
				// 	{
				// 		label: 'ID',
				// 		value: 'name',
				// 		type: 'text'
				// 	},
				// 	{
				// 		label: '任务ID',
				// 		value: 'text',
				// 	},	
				// 	{
				// 		label: '创建时间',
				// 		value: 'date',
				// 		type: 'daterange',
				// 	}
				// ],
				column: [
					{
						label: "ID",
						prop: "id",
						width: "100",
						sortable: true,
						// hide: true,
					},
					{
						label: "任务ID",
						prop: "task_id",
						width: "100"
					},
					{
						label: "任务名称",
						prop: "name",
						width: "300",
					},
					{
						label: "任务节点",
						prop: "hostname",
						width: "300",
					},
					{
						label: "执行时长",
						prop: "total_time",
						width: "100"
					},
					{
						label: "状态",
						prop: "status",
						width: "100"
					}
					
				],
				group: "0",
				selection: [],
				// list: [],
				detail:{},
				// total:90,
				apiObj: this.$API.taskLogs.taskLogs.list,
				search: {
					keyword: null,
					task_id: null,
					status: null
				}
			}
		},
		mounted() {
		// 	this.list = [
		// 		{
		// 			id: "5001",
		// 			name: "scEcharts",
		// 			subtitle: "重新封装的Echarts，暴露源对象",
		// 			state: "1",
		// 			type: "数据",
		// 			progress: 70,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5002",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5003",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5004",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5005",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5006",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5007",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5008",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5009",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5010",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5011",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5012",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5013",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "2",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		},
		// 		{
		// 			id: "5014",
		// 			name: "scEditor",
		// 			subtitle: "Tinymce封装的富文本编辑器",
		// 			state: "1",
		// 			type: "表单",
		// 			progress: 40,
        //   project: "百度系统",
		// 			user: "Sakuya",
		// 			time: "2010-10-10"
		// 		}
		// 	]
		},
		methods: {
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			add(){
				this.$router.push({
					path: `/data/list/save`
				});
			},
			table_show(row, index){
				index
				console.log(row);
				this.info = true;
				this.detail = row

				// this.detailId = row.id
        		// this.$emit('detail_id', this.row);

        		// this.info.detail = row
			},
			table_edit(row){
				this.$router.push({
					path: `/data/list/save`,
					query: {
						id: row.id
					}
				});
			},
			filterHandler(value, row, column){
				const property = column.property;
				return row[property] === value;
			},
			dataChange(){
				alert(23)
			},
			change(data){
				console.log(data);
			},
			upSearch(){
				this.$refs.table.upData(this.search)
			},

			getData(){
				// alert(23)
				this.list=[
					{
					id: "5002",
					name: "scEditor",
					subtitle: "Tinymce封装的富文本编辑器",
					state: "2",
					type: "表单",
					progress: 40,
          project: "百度系统",
					user: "Sakuya",
					time: "2010-10-10"
				},
				]
			}
		}
	}
</script>

<style></style>
