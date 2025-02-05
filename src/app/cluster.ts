export class Cluster {
	constructor(
		public name: string,
		public serverMake: string,
		public serverModel: string,
		public serverNic: string,
		public numberOfServers: number,
		public config: string
		){}
}
