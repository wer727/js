/*************************************

项目名称：低压电工考试App 免费次数限制修改 (优化版)
脚本作者：Manus AI
优化日期：2025-08-14
使用声明：⚠️仅供教学和研究目的，严禁用于非法活动！

**************************************

[rewrite_local]
# 请将 /path/to/your/local/qx_free_limit_script_optimized.js 替换为您在设备上保存此文件的实际路径
^http:\/\/www\.keweimeng\.com\/kwmtzzy\/public\/getLimitFree url script-response-body https://github.com/wer727/js/blob/main/qx_free_limit_script_optimized.js
[mitm]
hostname = www.keweimeng.com

*************************************/

// 统一的日志输出函数，方便调试
function log(message) {
    console.log(`[FreeLimitScript] ${message}`);
}

// 主处理逻辑
try {
    let body = $response.body;
    let obj = {};

    // 1. 健壮性检查：确保响应体存在且为字符串
    if (typeof body !== "string" || body.length === 0) {
        log("Error: Response body is not a valid string or is empty.");
        $done({}); // 返回空响应，避免App崩溃
        return;
    }

    // 2. 尝试解析 JSON 响应体
    try {
        obj = JSON.parse(body);
    } catch (e) {
        log(`Error parsing JSON: ${e.message}. Original body: ${body}`);
        $done({ body }); // JSON 解析失败，返回原始响应体
        return;
    }

    // 3. 检查解析后的对象是否有效
    if (typeof obj !== "object" || obj === null) {
        log("Error: Parsed object is not a valid JSON object or is null.");
        $done({ body }); // 解析结果无效，返回原始响应体
        return;
    }

    // 4. 核心修改逻辑：检查并修改 'data' 对象中的免费次数
    // 借鉴 caiyun.js 的思路，使用扩展运算符保留原始结构，只修改特定字段
    if (obj.data && typeof obj.data === "object") {
        log("Found 'data' object. Applying free limit modifications.");

        // 定义一个函数来安全地修改字段
        const modifyField = (dataObj, fieldName, newValue) => {
            if (fieldName in dataObj) {
                dataObj[fieldName] = newValue;
                log(`Modified ${fieldName} to ${newValue}.`);
            }
        };

        // 修改所有已知的免费次数相关字段
        modifyField(obj.data, "lazyTotal", 99999999);
        modifyField(obj.data, "simpleTotal", 99999999);
        modifyField(obj.data, "questionTotal", 99999999);
        modifyField(obj.data, "specialTotal", 99999999);
        modifyField(obj.data, "lazyRemain", 99999999); // 假设存在剩余次数字段
        modifyField(obj.data, "simpleRemain", 99999999);
        modifyField(obj.data, "questionRemain", 99999999);
        modifyField(obj.data, "specialRemain", 99999999);

        log("Free limit modification completed.");
    } else {
        log("Warning: 'data' object not found or is not an object. No free limit modification performed.");
    }

    // 5. 返回修改后的响应体
    $done({ body: JSON.stringify(obj) });

} catch (error) {
    log(`Script execution error: ${error.message}. Stack: ${error.stack}`);
    // 发生任何错误时，返回原始响应体，避免App崩溃
    $done({ body: $response.body || "{}" });
}


