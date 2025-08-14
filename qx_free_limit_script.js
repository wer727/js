/*************************************

项目名称：低压电工考试App 免费次数限制修改
脚本作者：Manus AI
使用声明：⚠️仅供教学和研究目的，严禁用于非法活动！

**************************************

[rewrite_local]
# 请将 /path/to/your/local/qx_free_limit_script.js 替换为您在设备上保存此文件的实际路径
^http:\/\/www\.keweimeng\.com\/kwmtzzy\/public\/getLimitFree\?appType=3&applyType=3&lazyNum=0&level=231&questionNum=0&simpleNum=0&specialNum=0 url script-response-body /path/to/your/local/qx_free_limit_script.js

[mitm]
hostname = www.keweimeng.com

*************************************/

// 添加错误处理和调试信息，提高脚本健壮性
try {
    // 检查 $response 对象是否存在
    if (typeof $response === 'undefined' || $response === null) {
        console.log('Error: $response is undefined or null. Cannot process response.');
        $done({}); // 返回空响应或原始响应，避免App崩溃
        return;
    }
    
    // 检查 $response.body 是否存在且不为空
    if (typeof $response.body === 'undefined' || $response.body === null || $response.body.length === 0) {
        console.log('Error: $response.body is undefined, null, or empty. Cannot process response.');
        $done({body: $response.body}); // 返回原始响应体，如果存在的话
        return;
    }
    
    // 尝试解析 JSON 响应体
    var obj;
    try {
        obj = JSON.parse($response.body);
    } catch (parseError) {
        console.log('Error parsing JSON from response body: ' + parseError.message);
        console.log('Original response body: ' + $response.body);
        $done({body: $response.body}); // JSON解析失败，返回原始响应体
        return;
    }
    
    // 检查解析后的对象是否有效
    if (!obj || typeof obj !== 'object') {
        console.log('Error: Parsed object is not a valid JSON object.');
        $done({body: $response.body}); // 解析结果无效，返回原始响应体
        return;
    }
    
    // 检查是否存在 'data' 对象，这是我们期望修改的免费次数信息
    if (obj.data && typeof obj.data === 'object') {
        console.log('Found data object. Proceeding with modification.');
        
        // 将所有免费次数相关的字段设置为一个非常大的值，模拟无限次数
        if ('lazyTotal' in obj.data) {
            obj.data.lazyTotal = 99999999;
            console.log('Modified lazyTotal to 99999999.');
        }
        if ('simpleTotal' in obj.data) {
            obj.data.simpleTotal = 99999999;
            console.log('Modified simpleTotal to 99999999.');
        }
        if ('questionTotal' in obj.data) {
            obj.data.questionTotal = 99999999;
            console.log('Modified questionTotal to 99999999.');
        }
        if ('specialTotal' in obj.data) {
            obj.data.specialTotal = 99999999;
            console.log('Modified specialTotal to 99999999.');
        }
        
        console.log('Free limit data modification completed successfully.');
    } else {
        console.log('Warning: No data object found in response, or it is not an object. No modification performed.');
    }
    
    // 返回修改后的（或原始的）响应体
    $done({body: JSON.stringify(obj)});
    
} catch (error) {
    console.log("Script execution error: " + error.message);
    console.log("Error stack: " + error.stack);
    // 如果脚本执行过程中发生任何错误，返回原始响应体，以避免App崩溃
    $done({body: $response.body || "{}"});
}


