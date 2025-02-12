export class Cluster {
	constructor(
		public name: string = '',
		public serverMake: string = '',
		public serverModel: string = '',
		public serverNicsList: string[] = [''], 
		public numberOfServers: number = 0,
		public config: string = ''
		){}
}
