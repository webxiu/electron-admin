// 启动服务
./guoyinlijian.exe [serv address] [db path] [file store path] [log path]
- [serv address]: API服务监听地址
- [db path]: 数据库文件路径，确保该路径所在目录是存在的
- [file store path]: 文件存储路径，必须使用绝对路径
- [log path]: 日志路径

// 例
./guoyinlijian.exe :5001 ./data/local.db G:/lijian_storage ./logs


// 依赖工具与服务
- resource: 依赖工具，必须与可执行文件放在同目录下。
- windows_microservices: 算法服务，必须与可执行文件放在同目录下。