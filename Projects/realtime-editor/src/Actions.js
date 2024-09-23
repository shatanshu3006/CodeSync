// all the events that we are making in EditorPage.js,  from socketRef initialisation to 
//ascync await function of init are bundled here in actions.js root directory
// this is for a better encapsulation of the code

const ACTIONS={
    JOIN:'join',
    JOINED:'joined',
    DISCONNECTED:'disconnected',
    CODE_CHANGE:'code-change',
    SYNC_CODE:'sync-code',
    LEAVE:'leave'
};

module.exports=ACTIONS;         //->using this for NodeJs applications

// export default ACTIONS;        // this is generally used for client side js applications
//Key Differences Between module.exports and export default
	// 1.	Environment:
	// •	module.exports is the syntax used in CommonJS modules, which is the module system used by Node.js (including Express projects).
	// •	export default is the syntax for ES Modules (ESM), which is used in modern JavaScript (ECMAScript), often in client-side (browser) JavaScript, and is also supported in Node.js but under certain conditions (more on this below).
	// 2.	Node.js Support:
	// •	By default, Node.js uses the CommonJS module system, where you use require to import modules and module.exports to export them. If you’re not specifically enabling ESM in your project, you should stick with module.exports.