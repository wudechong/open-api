/** 操作类型 - 打印预览:0 直接打印:1 打印设计:2 打印设计预览:3前往打印设计 */
var operModeList = {
    "preview": 0,
    "print": 1,
    "print_config": 2,
    "design": 3
};

var templateTypeList = {
    "express_doc": 1,
    "dispatch_doc": 2,
    "allot_doc": 3,
    "bar_code": 4,
    "outbound_doc": 5,
    "inbound_doc": 6,
    "transfer_doc": 7,
    "refund_inbound": 8,
    "pchs_bill": 9,
    "inv_check": 10,
    "cn_express_doc": 11,
    "dispatch_lateralsize": 12,
    "dispatch_package": 13,
    "inbound_bill": 15,
    "outbound_bill": 16,
    "storage_loc": 17,
    "cnsl_express_doc": 18,
    "package_m": 19,
    "equipment": 20,
    "productBill": 21,
    "pick_label": 22,
    "advancesReceived": 23,
    "payBill": 24,
    "unique_code": 25,
    "goods_tags": 26,
    "unique_code_collect": 27,
    "transfer_lateral": 28,
    "pos_trade": 29,
    "shift_turnover_record": 200,
    "same_item": 31,
    "goods_label": 131,
    "shipping_label": 132,
    "pchs_bill_lateralsize": 32,
    "inbound_lateralsize": 33,
    "refund_inbound_lateralsize": 34,
    "addr_express_doc": 128,
    "declaration_bill": 129,
    "ali_express_doc": 130,
    "cnyl_express_doc": 35,
    "pdd_express": 36,
    "pdd_express_yl": 37,
    "pchs_send_bill": 38,
    "supplier_pchs_bill": 39,
    "jd_common_express_doc": 46,
    "jd_yl_express_doc": 47,
    "jos_express_100_doc": 48,
    "jos_express_76_doc": 49,
    "douyin_express_common_doc": 50,
    "douyin_express_yilian_doc": 51,
    "pdd_express_sl": 56,
    "kwai_express_doc_yl": 57,
    "kwai_express_doc": 58,
    "advancePayment": 230
};

var PrintCenter = new function () {
    var _self = this;
    this.editorUrl = "http://dev.hupun.org:9285/static/index.html#/print";
    this.view;
    this.printingObj = new Object();
    this.printingMap = new Object();
    this.taskObject = new Object();
    this.tip;
    this.reSendTask;
    this.getTaskID;
    this.callback;
    this.updateStatusMode = 1;
    this.hasOpen = false;
    this.printToolType = "caiNiao";
    this.seriesCloudPrint = false;//控件任务依次下发，等上一个控件任务执行完后执行下一个
    this.seriesCloudPrintTasks = new Array();
    this.seriesPrintingTasks = new Array();

    this.init = function (view) {
        _self.view = view;
        CainiaoPrint.init(view);
        PddCloudPrint.init(view);
        YunJiCloudPrint.init(view);
        JDCloudPrint.init(view);
        DoudianPrint.init(view);
        MeituanPrint.init(view);
        KuaishouPrint.init(view);
        VipCloudPrint.init(view);
        LodopPrint.init(view);
    }

    this.getTemplateType = function (type) {
        if (type == templateTypeList.cn_express_doc || type == templateTypeList.cnsl_express_doc || type == templateTypeList.cnyl_express_doc ||
            type == templateTypeList.pdd_express || type == templateTypeList.pdd_express_yl || type == templateTypeList.pdd_express_sl ||
            type == templateTypeList.jd_common_express_doc || type == templateTypeList.jd_yl_express_doc ||
            type == templateTypeList.jos_express_100_doc || type == templateTypeList.jos_express_76_doc ||
            type == templateTypeList.douyin_express_common_doc || type == templateTypeList.douyin_express_yilian_doc ||
            type == templateTypeList.kwai_express_doc_yl || type == templateTypeList.kwai_express_doc) {
            return templateTypeList.express_doc;
        } else if (type == templateTypeList.dispatch_lateralsize) {
            return templateTypeList.dispatch_doc;
        } else if (type == templateTypeList.pchs_bill_lateralsize) {
            return templateTypeList.pchs_bill;
        } else if (type == templateTypeList.pchs_inbound_lateralsize) {
            return templateTypeList.pchs_inbound;
        } else if (type == templateTypeList.transfer_lateralsize) {
            return templateTypeList.transfer_doc;
        } else if (type == templateTypeList.refund_inbound_lateralsize) {
            return templateTypeList.refund_inbound;
        } else {
            return type;
        }
    }

    this.openEditor = function (template, url) {
        if (url != null && url != '') _self.editorUrl = url;
        let id = template.templateUid ? template.templateUid : template.id;
        let type = _self.getTemplateType(template.templateType) ? _self.getTemplateType(template.templateType) : template.type;
        window.open(_self.editorUrl + "?companyID=1&templateID=" + id + "&templateType=" + type + "&subType=" + template.subType);
    }

    this.print = function (datas, operMode, callback, callbackParams) {
        if (datas.length < 1) return;
        if (datas[0].type != "SYS" && datas[0].type != "LODOP") {//非系统和LODOP
            _self.printOnline(datas[0].type, datas[0].otherData);
            return;
        }
        if (myBrowser() == "IE" || myBrowser() == "IE7" || myBrowser() == "IE8" || myBrowser() == "IE9" || myBrowser() == "IE10") {
            alert(("新版菜鸟打印控件不支持此浏览器，请更换以下浏览器:\n" +
                "* IE 11及以上\n" +
                "* chrome 16及以上（建议使用chrome的最新版本）\n" +
                "* Firefox 45及以上（建议使用firefox的最新版本）\n" +
                "* 搜狗浏览器（极速模式）\n" +
                "* 360浏览器（极速模式）\n" +
                "* QQ浏览器（极速模式）\n"));
        }
        if (operMode == operModeList.design) { // 前往打印设计

        } else if (operMode == operModeList.print_config) {// 打印预览与配置

        } else {
            _self.callback = callback;
            if (_self.view && _self.view.get("#tip_loading_prt")) _self.view.get("#tip_loading_prt").show();

            if (_self.seriesCloudPrint) {
                _self.seriesCloudPrintTasks = new Array(); //清空历史残留任务，避免影响新的打印
                _self.seriesPrintingTasks = new Array(); //清空历史残留任务，避免影响新的打印
                // 打印控件打印任务排序依次完成
                for (var i = 0; i < datas.length; i++) {
                    _self.seriesCloudPrintTasks.push(datas[i]);
                }
                _self.printDataByToolType(callbackParams);
            } else {
                var cainiaoArr = new Array();
                var yunjiArr = new Array();
                var pddArr = new Array()
                var jdArr = new Array();
                var douyinArr = new Array();
                var lodopArr = new Array();
                var meituanArr = new Array();
                var kuaishouArr = new Array();
                var vipArr = new Array();
                for (var i = 0; i < datas.length; i++) {
                    var request = datas[i];
                    if (request.toolType == 3 || request.yunJi) {
                        yunjiArr.push(request);
                    } else if (request.toolType == 2 || request.pdd) {
                        pddArr.push(request);
                    } else if (request.toolType == 4) {
                        jdArr.push(request);
                    } else if (request.toolType == 5) {
                        douyinArr.push(request);
                    } else if (request.toolType == 6) {
                        lodopArr.push(request);
                    } else if (request.toolType == 7) {
                        meituanArr.push(request);
                    } else if (request.toolType == 8) {
                        kuaishouArr.push(request);
                    } else if (request.toolType == 9) {
                        vipArr.push(request);
                    } else {
                        cainiaoArr.push(request);
                    }
                }
                if (yunjiArr.length > 0) _self.printData(yunjiArr, callbackParams);
                if (pddArr.length > 0) _self.printData(pddArr, callbackParams);
                if (cainiaoArr.length > 0) _self.printData(cainiaoArr, callbackParams);
                if (jdArr.length > 0) _self.printData(jdArr, callbackParams);
                if (douyinArr.length > 0) _self.printData(douyinArr, callbackParams);
                if (lodopArr.length > 0) _self.printData(lodopArr, callbackParams);
                if (meituanArr.length > 0) _self.printData(meituanArr, callbackParams);
                if (kuaishouArr.length > 0) _self.printData(kuaishouArr, callbackParams);
                if (vipArr.length > 0) _self.printData(vipArr, callbackParams);
            }
        }
    }

    this.refreshSeriesPrintingTasks = function (data) {
        if (!_self.seriesCloudPrint) return;
        var taskID = data.taskID;
        if (_self.seriesPrintingTasks.length > 0 && _self.seriesPrintingTasks.indexOf(taskID) > -1) {
            _self.seriesPrintingTasks.splice(_self.seriesPrintingTasks.indexOf(taskID), 1);
        }
        if (_self.seriesPrintingTasks.length == 0) {
            _self.printDataByToolType();
        }
    }

    this.printDataByToolType = function (callbackParams) {
        // 校验所有打印任务的打印组件是否开启
        var printToolTypes = new Array();
        for (var i = 0; i < _self.seriesCloudPrintTasks.length; i++) {
            var request = _self.seriesCloudPrintTasks[i];
            var curToolType = request.toolType;
            if (request.yunJi) curToolType = 3;
            if (request.pdd) curToolType = 2;
            if (!curToolType) curToolType = 0;
            if (printToolTypes.indexOf(curToolType)) printToolTypes.push(curToolType);
        }
        if (printToolTypes.indexOf(0) > -1 && !CainiaoPrint.hasConnected()) {
            CainiaoPrint.alertBox();
            _self.seriesCloudPrintTasks = new Array();
            return;
        }
        if (printToolTypes.indexOf(2) > -1 && !PddCloudPrint.hasConnected()) {
            PddCloudPrint.alertBox();
            _self.seriesCloudPrintTasks = new Array();
            return;
        }
        if (printToolTypes.indexOf(3) > -1 && !YunJiCloudPrint.hasConnected()) {
            YunJiCloudPrint.alertBox();
            _self.seriesCloudPrintTasks = new Array();
            return;
        }
        if (printToolTypes.indexOf(4) > -1 && !JDCloudPrint.hasConnected()) {
            JDCloudPrint.alertBox();
            if (JDCloudPrint.view) JDCloudPrint.view.get("#tip_loading_prt").hide();
            _self.seriesCloudPrintTasks = new Array();
            return;
        }
        if (printToolTypes.indexOf(5) > -1 && !DoudianPrint.hasConnected()) {
            DoudianPrint.alertBox();
            _self.seriesCloudPrintTasks = new Array();
            return;
        }
        if (printToolTypes.indexOf(6) > -1 && !LodopPrint.getLodop()) {
            LodopPrint.alertBox();
            _self.seriesCloudPrintTasks = new Array();
            return;
        }
        if (printToolTypes.indexOf(7) > -1 && !MeituanPrint.hasConnected()) {
            MeituanPrint.alertBox();
            _self.seriesCloudPrintTasks = new Array();
            return;
        }
        if (printToolTypes.indexOf(8) > -1 && !KuaishouPrint.hasConnected()) {
            KuaishouPrint.alertBox();
            _self.seriesCloudPrintTasks = new Array();
            return;
        }
        if (printToolTypes.indexOf(9) > -1 && !VipCloudPrint.hasConnected()) {
            VipCloudPrint.alertBox();
            _self.seriesCloudPrintTasks = new Array();
            return;
        }
        // 确认控件都开启后执行打印
        var curPrintArr = new Array();
        var oldToolType = 0;
        var taskLength = _self.seriesCloudPrintTasks.length;
        for (var i = 0; i < taskLength; i++) {
            var request = _self.seriesCloudPrintTasks[0];
            var curToolType = request.toolType;
            if (request.yunJi) curToolType = 3;
            if (request.pdd) curToolType = 2;
            if (!curToolType) curToolType = 0;
            if (i > 0 && oldToolType != curToolType) {
                break;
            }
            oldToolType = curToolType;
            curPrintArr.push(request);
            _self.seriesPrintingTasks.push(request.task.taskID);
            _self.seriesCloudPrintTasks.splice(0, 1);
        }
        if (curPrintArr.length > 0) {
            _self.printData(curPrintArr, callbackParams);
        }
    }

    this.printData = function (datas, callbackParams) {
        var renderCallback = function (json, printingMap) {
            var taskID = json.taskID;
            var cmd = json.cmd;
            var status = json.status ? json.status : json.taskStatus;
            var billIDs = "";
            var billNos = "";
            //var templateType = template.templateType;
            //var prt_copies = template.prt_copies;
            if (printingMap[taskID] != null) {
                var arr = printingMap[taskID];
                for (var i = 0; i < arr.length; i++) {
                    var obj = arr[i];
                    var billID = obj.billID;
                    var billNo = obj.billNo;

                    //templateType = obj.templateType;
                    //prt_copies = obj.prt_copies;
                    if (billIDs != "") billIDs += ",";
                    billIDs += billID;
                    if (billNos != "") billNos += ",";
                    billNos += billNo;
                }
                delete printingMap[taskID];
            } else {
                if (_self.view && _self.view.get("#tip_loading_prt")) _self.view.get("#tip_loading_prt").hide();
                // return;
            }
            var num = 0;
            for (var i in printingMap) {
                num++;
            }
            if ("print" == cmd && billIDs != "" && status == "success") {
                if (_self.callback && _self.updateStatusMode != 2) _self.callback(billIDs, billNos, null, 1, num == 0, _self.view, callbackParams);
            } else if ("notifyPrintResult" == cmd && (status == "failed" || status == "FAILED") && billIDs == "") {//返回失败消息，并且打印状态已经更新了，此时需要把打印状态更新回去
                var printStatus = json.printStatus;
                var msg = "";
                if (printStatus && printStatus.length > 0) {
                    for (var i = 0; i < printStatus.length; i++) {
                        var obj = printStatus[i];
                        var billID = obj.documentID;
                        if (billIDs != "") billIDs += ",";
                        billIDs += billID;
                        if (msg == "") msg = obj.msg;
                    }
                    if (_self.callback) _self.callback(billIDs, billNos, msg, 0, num == 0, _self.view, callbackParams);
                }
            } else if ("notifyPrintResult" == cmd && (status == "printed" || status == "success")) {
                if (_self.callback && _self.updateStatusMode != 2) _self.callback(billIDs, billNos, null, 1, num == 0, _self.view, callbackParams);
            } else if (_self.updateStatusMode == 2 && status == "failed" && billIDs != "") {
                if (_self.callback) _self.callback(billIDs, billNos, json.msg, 0, num == 0, _self.view, callbackParams);
            }
        }

        var request = datas[0];
        var preview = request.task ? request.task.preview : false;
        _self.updateStatusMode = request.updateStatusMode != null ? request.updateStatusMode : 0;
        var printArr = new Array();
        for (var i = 0; i < datas.length; i++) {
            var req = datas[i];
            var config = req.config;
            if (config == null) continue;
            var printer = config.printer;
            if (!printArr.includes(printer)) {
                printArr.push(printer);
                _self.setConfig(req, renderCallback);
            }
        }
        // console.log('_self.doPrint', datas)
        _self.doPrint(datas);

        if (!preview && _self.view) {
            _self.view.get("#dialogPrintConfig").hide();
        }
    }

    this.setConfig = function (request, renderCallback) {
        var preview = request.task ? request.task.preview : false;
        var needLogo = request.needLogo;
        var orient = request.orient;
        var multiPage = request.multiPage ? request.multiPage : 1;
        var width = request.width;
        var height = request.height;
        var printLimit = request.printLimit;
        var config = request.config;
        var leftOffset = config.leftOffset;
        var topOffset = config.topOffset;
        var printer = config.printer;

        if (orient == 3 && height < 3200) {
            height = 3200;
        } else if (orient == 2) {
            var temp = width;
            width = height;
            height = temp;
        }
        width *= multiPage;

        if (request.toolType == 3 || request.yunJi) {
            _self.printToolType = "yunJi";
            YunJiCloudPrint.renderCallBack = renderCallback;
        } else if (request.toolType == 2 || request.pdd) {
            _self.printToolType = "pdd";
            PddCloudPrint.isPreview = preview;
            PddCloudPrint.renderCallBack = renderCallback;
            PddCloudPrint.doSetPrinterConfig(printer, leftOffset, topOffset, needLogo, needLogo, width, height, printLimit);
        } else if (request.toolType == 4) {
            _self.printToolType = "jd";
            JDCloudPrint.isPreview = preview;
            JDCloudPrint.renderCallBack = renderCallback;
        } else if (request.toolType == 5) {
            _self.printToolType = "douyin";
            DoudianPrint.isPreview = preview;
            DoudianPrint.renderCallBack = renderCallback;
        } else if (request.toolType == 6) {
            _self.printToolType = "lodop";
            LodopPrint.isPreview = preview;
            LodopPrint.renderCallBack = renderCallback;
        } else if (request.toolType == 7) {
            _self.printToolType = "meituan";
            MeituanPrint.isPreview = preview;
            MeituanPrint.renderCallBack = renderCallback;
        } else if (request.toolType == 8) {
            _self.printToolType = "kuaishou";
            KuaishouPrint.isPreview = preview;
            KuaishouPrint.renderCallBack = renderCallback;
        } else if (request.toolType == 9) {
            _self.printToolType = "vip";
            VipCloudPrint.isPreview = preview;
            VipCloudPrint.renderCallBack = renderCallback;
        } else {
            _self.printToolType = "caiNiao";
            CainiaoPrint.isPreview = preview;
            CainiaoPrint.renderCallBack = renderCallback;
            CainiaoPrint.doSetPrinterConfig(printer, leftOffset, topOffset, needLogo, needLogo, width, height);
        }
    }

    this.doPrint = function (datas, reSend) {
        if (_self.printToolType == "yunJi") {
            YunJiCloudPrint.doPrint(datas);
        } else if (_self.printToolType == "pdd") {
            PddCloudPrint.doPrint(datas, reSend);
        } else if (_self.printToolType == "jd") {
            JDCloudPrint.doPrint(datas, reSend);
        } else if (_self.printToolType == "douyin") {
            DoudianPrint.doPrint(datas, reSend);
        } else if (_self.printToolType == "lodop") {
            LodopPrint.doPrint(datas, reSend);
        } else if (_self.printToolType == "meituan") {
            MeituanPrint.doPrint(datas, reSend);
        } else if (_self.printToolType == "kuaishou") {
            KuaishouPrint.doPrint(datas, reSend);
        } else if (_self.printToolType == "vip") {
            VipCloudPrint.doPrint(datas, reSend);
        } else {
            CainiaoPrint.doPrint(datas, reSend);
        }
    }

    this.doConnect = function () {
        if (_self.printToolType == "yunJi") {
            YunJiCloudPrint.doConnect();
        } else if (_self.printToolType == "pdd") {
            PddCloudPrint.doConnect();
        } else if (_self.printToolType == "jd") {
            JDCloudPrint.doConnect();
        } else if (_self.printToolType == "douyin") {
            DoudianPrint.doConnect();
        } else if (_self.printToolType == "meituan") {
            MeituanPrint.doConnect();
        } else if (_self.printToolType == "kuaishou") {
            KuaishouPrint.doConnect();
        } else if (_self.printToolType == "vip") {
            VipCloudPrint.doConnect();
        } else {
            CainiaoPrint.doConnect();
        }
    }

    this.printOnline = function (type, data) {
        if (type == "URL") {
            window.open(data);
        } else if (type == "STREAM") {
            _self.createObjectURL(data, "application/pdf", "面单" + getFormatDate());
        } else if (type == "JSON") {
            var json = dorado.JSON.parse(data);
            if (json.length > 0) {
                var msg = "";
                for (var i = 0; i < json.length; i++) {
                    var d = json[i];
                    if (d.success == true) {
                        window.open(d.url);
                    } else {
                        if (msg == "") msg += "以下订单生成pdf失败\n";
                        msg += d.logisticNo + ":" + d.msg + ";\n";
                    }
                }
                if (msg != "") dorado.MessageBox.alert(msg);
            }
        }
    }

    this.createObjectURL = function (content, fileType, fileName) {
        var data = new Object();
        data.type = "createObjectURL";
        data.content = content;
        data.fileType = fileType;
        data.fileName = fileName;
        window.parent.postMessage(data, '*');
    }

    this.getPrinterList = function () {
        if (CainiaoPrint.getPrinterList() != null && CainiaoPrint.getPrinterList().length > 0) {
            return CainiaoPrint.getPrinterList();
        } else if (PddCloudPrint.getPrinterList() != null && PddCloudPrint.getPrinterList().length > 0) {
            return PddCloudPrint.getPrinterList();
        } else if (JDCloudPrint.getPrinterList() != null && JDCloudPrint.getPrinterList().length > 0) {
            return JDCloudPrint.getPrinterList();
        } else if (DoudianPrint.getPrinterList() != null && DoudianPrint.getPrinterList().length > 0) {
            return DoudianPrint.getPrinterList();
        } else if (MeituanPrint.getPrinterList() != null && MeituanPrint.getPrinterList().length > 0) {
            return MeituanPrint.getPrinterList();
        } else if (KuaishouPrint.getPrinterList() != null && KuaishouPrint.getPrinterList().length > 0) {
            return KuaishouPrint.getPrinterList();
        } else if (VipCloudPrint.getPrinterList() != null && VipCloudPrint.getPrinterList().length > 0) {
            return VipCloudPrint.getPrinterList();
        } else if (LodopPrint.getPrinterList() != null && LodopPrint.getPrinterList().length > 0) {
            return LodopPrint.getPrinterList();
        } else {
            return null;
        }
    }

    this.refreshStatus = function (data) {
        var cmd = data.cmd;
        var taskID = data.taskID;
        var statusTD = $("#" + taskID + "_status");
        if (!statusTD) statusTD = $("<div></div>");
        var infoTD = $("#" + taskID + "_info");
        if (!infoTD) infoTD = $("<div></div>");
        var task = _self.taskObject[taskID];
        if (task == null) {
            var status = data.status ? data.status : data.taskStatus;
            if (("notifyPrintResult" == cmd || "PrintResultNotify" == cmd) && status == "failed") {//返回失败消息，并且打印状态已经更新了，此时需要把打印状态更新回去
                var printStatus = data.printStatus;
                var msg = "";
                if (printStatus && printStatus.length > 0) {
                    var billIDs = '';
                    var billNos = '';
                    for (var i = 0; i < printStatus.length; i++) {
                        var obj = printStatus[i];
                        var billID = obj.documentID;
                        if (billIDs != "") billIDs += ",";
                        billIDs += billID;
                        if (msg == "") msg = obj.msg;
                    }
                    if (_self.callback) _self.callback(billIDs, billNos, msg, 0, false, _self.view);
                }
            }
            return;
        }

        if (cmd == "print") {
            var status = data.status;
            if (status == "success" && task.taskStatus == "sending") {
                statusTD.attr("taskStatus", "print").css("color", "green").html("控件已接收");
                task.taskStatus = "print";
                if (_self.updateStatusMode == 3) {
                    _self.updateStatus(taskID);
                }
            } else if (status != "success") {
                statusTD.attr("taskStatus", "failed").css("color", "red").html("发送失败");
                task.taskStatus = "sendFailed";
            }
        } else if (cmd == "notifyPrintResult" || cmd == "PrintResultNotify") {
            var taskStatus = data.taskStatus;
            var details = data.printStatus;
            var taskMsg = data.msg;
            var sucess = true;
            if (details != null) {
                for (var i = 0; i < details.length; i++) {
                    var doc = details[i];
                    var documentID = doc.documentID;
                    var status = doc.status;
                    var msg = doc.msg;
                    var taskDoc = task.documents;
                    for (var j = 0; j < taskDoc.length; j++) {
                        if (taskDoc[j].documentID == documentID) {
                            taskDoc[j].status = status;
                            taskDoc[j].msg = msg;
                        }
                    }
                    if (status != "success") {
                        sucess = false;
                    }
                }
            }
            if (taskStatus == "rendered") {
                if (task.taskStatus == "sending" || task.taskStatus == "print") {
                    if (sucess) {
                        statusTD.attr("taskStatus", "rendered").css("color", "green").html("渲染完成");
                        task.taskStatus = "rendered";
                    } else {
                        statusTD.attr("taskStatus", "failed").css("color", "red").html("渲染失败").attr("title", taskMsg);
                        task.taskStatus = "failed";
                    }
                }
            } else if (taskStatus == "printed") {
                if (sucess) {
                    statusTD.attr("taskStatus", "printed").css("color", "green").html("打印成功");
                    task.taskStatus = "printed";
                    if (_self.updateStatusMode == 1) {
                        _self.updateStatus(taskID);
                    }
                } else {
                    statusTD.attr("taskStatus", "failed").css("color", "red").html("打印异常").attr("title", taskMsg);
                    task.taskStatus = "failed";
                }
            } else if (taskStatus == "failed") {
                statusTD.attr("taskStatus", "failed").css("color", "red").html("打印异常").attr("title", taskMsg);
                task.taskStatus = "failed";
            }
        } else if (cmd == "close") {
            if (task.taskStatus != "sendFailed" && task.taskStatus != "sending" && task.taskStatus != "printed" && task.taskStatus != "failed") {
                var taskDoc = task.documents;
                for (var j = 0; j < taskDoc.length; j++) {
                    taskDoc[j].status = "close";
                    taskDoc[j].msg = "链接断开";
                }
                statusTD.attr("taskStatus", "close").css("color", "red").html("链接断开").attr("title", "与打印控件的链接已断开");
                task.taskStatus = "close";
            }
        }
        var isOver = true;
        var hasPrinted = true;
        for (var key in _self.taskObject) {
            var taskStatus = _self.taskObject[key].taskStatus;
            if (_self.updateStatusMode == 3) {
                if (taskStatus == "sending") {
                    hasPrinted = false;
                    isOver = false;
                }
            } else {
                if (taskStatus != "printed") {
                    hasPrinted = false;
                }
                if (taskStatus != "printed" && task.taskStatus != "failed") {
                    isOver = false;
                }
            }
        }
        if (hasPrinted) {
            _self.taskObject = new Object();
            _self.hideDialog();
        }
        if (isOver) {
            $("#closePrintStatusDialog").css("display", "block");
        }
    }

    this.updateStatus = function (taskID) {
        var billIDs = "";
        var billNos = "";
        if (PrintCenter.printingMap[taskID] != null) {
            var arr = PrintCenter.printingMap[taskID];
            for (var i = 0; i < arr.length; i++) {
                var obj = arr[i];
                var billID = obj.billID;
                var billNo = obj.billNo;

                if (billIDs != "") billIDs += ",";
                billIDs += billID;
                if (billNos != "") billNos += ",";
                billNos += billNo;
            }
            delete PrintCenter.printingMap[taskID];
        } else {
            if (_self.view && _self.view.get("#tip_loading_prt")) _self.view.get("#tip_loading_prt").hide();
            return;
        }
        var num = 0;
        for (var i in PrintCenter.printingMap) {
            num++;
        }

        if (_self.callback) _self.callback(billIDs, billNos, null, 1, num == 0);
    }

    this.onClose = function () {
        var taskIDs = new Array();
        _self.reSendTask = new Object();
        _self.hasOpen = false;
        for (var key in _self.taskObject) {
            var task = _self.taskObject[key];
            var data = {
                cmd: "close",
                taskID: key
            };
            _self.refreshStatus(data);
            // if(task.taskStatus != "sendFailed" && task.taskStatus != "sending"){
            taskIDs.push(key);
            _self.reSendTask[key] = task;
            // }
        }
        if (taskIDs.length > 0) {
            _self.getTaskID = parseInt(100000000 * Math.random()) + "";
            _self.doConnect();
            var n = 0;
            var intID = setInterval(function () {
                n++;
                console.log("检查是否连接：" + _self.hasOpen);
                if (_self.hasOpen == true) {
                    clearInterval(intID);
                    if (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) {
                        _self.getTaskStatus(_self.getTaskID, taskIDs);
                    }
                } else {
                    if (n % 5 == 0) {
                        _self.doConnect();
                    }
                }
            }, 1500);
        }
    }

    this.getTaskStatus = function (requestID, taskArr) {
        if (_self.printToolType == "pdd") {
            PddCloudPrint.doGetTaskStatus(requestID, taskArr);
        } else {
            CainiaoPrint.doGetTaskStatus(requestID, taskArr);
        }
    }

    this.getTaskStatusHandler = function (data) {
        console.log("getTaskStatusHandler");
        console.log(data);
        var requestID = data.requestID;
        if (_self.getTaskID != null && _self.getTaskID == requestID) {
            var printStatus = data.printStatus;
            if (printStatus.length > 0) {
                for (var i = 0; i < printStatus.length; i++) {
                    var prs = printStatus[i];
                    var id = prs.taskID;
                    if (_self.reSendTask[id] != null) {
                        var detailStatus = prs.detailStatus;
                        if (detailStatus != null) {
                            var taskStatus = "printed";
                            var cmd = "notifyPrintResult";
                            if (_self.updateStatusMode == 3) {
                                taskStatus = "sending";
                                cmd = "print";
                            }
                            var msg = "成功";
                            for (var j = 0; j < detailStatus.length; j++) {
                                if (detailStatus[j].status != "success") {
                                    taskStatus = "failed";
                                    msg = detailStatus[j].msg;
                                }
                            }
                            var data = {
                                cmd: cmd,
                                taskID: id,
                                taskStatus: taskStatus,
                                status: "success",
                                msg: msg,
                                printStatus: detailStatus
                            }
                            if (_self.taskObject[id]) {
                                _self.taskObject[id].taskStatus = (taskStatus == "failed" ? taskStatus :
                                    (_self.updateStatusMode == 3 ? "sending" : "print"));
                                _self.refreshStatus(data);
                            }
                        }
                        delete _self.reSendTask[id];
                    }
                }
            }
            var reqArr = new Array();
            for (var k in _self.reSendTask) {
                var req = {
                    "cmd": "print",
                    "requestID": parseInt(100000000 * Math.random()) + "",
                    "version": "1.0",
                    "task": _self.reSendTask[k]
                };
                reqArr.push(req);
            }
            _self.doPrint(reqArr, true);
        }
    }

    this.showProcess = function (printingMap) {
        var trStyle = "style = 'border: 1px solid #000000; border-width: 0 0px 1px 1px;'";
        var table = $("<table id='printStatusTable' border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style='border:1px solid #000000;border-width: 1px 1px 1px 1px; width:640px;'></table>");
        table.append("<thead style='width: calc( 100% - 1em);'><tr style='display: table;width: 100%;table-layout: fixed;'>" +
            "<th width='200px' style = 'border: 1px solid #000000; border-width: 0 0px 1px 0px;'>任务ID</th>" +
            "<th width='100px' " + trStyle + ">文档数</th>" +
            "<th width='100px' " + trStyle + ">任务状态</th>" +
            "<th " + trStyle + ">提示信息</th>" +
            "</tr></thead>");
        var tbody = $("<tbody style='display: block;height: 200px;overflow-y: scroll;'></tbody>");
        for (var taskID in printingMap) {
            var arr = printingMap[taskID];
            tbody.append("<tr style='display: table;width: 100%;table-layout: fixed;text-align: center;'>" +
                "<td width='200px' style = 'border: 1px solid #000000; border-width: 0 0px 1px 0px;'>" +
                "<div style='width:198px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='" + taskID + "'>" + taskID + "</div></td>" +
                "<td width='100px' " + trStyle + " ><a href='#' onclick='PrintCenter.showDetail(\"" + taskID + "\")' id='\"+taskID+\"_detail'>" + arr.length + "</a></td>" +
                "<td width='100px' id='" + taskID + "_status' " + trStyle + " taskStatus='sending' style='color: #FCD113;'>发送中</td>" +
                "<td id='" + taskID + "_info' " + trStyle + " style='color: #FCD113;'></td>" +
                "</tr>");
        }
        table.append(tbody);
        _self.printStatusDialog("打印状态", table);
    }

    this.printStatusDialog = function (title, message) {
        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        if ($("#printWindowContent") && $("#printWindowContent").length > 0) {
            $("#printWindowContent").html(message);
        } else {
            $("body").append("<div id='printStatusDialog' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
                "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
                "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
                "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:120px;" +
                "width:680px;height:300px;z-index:999991;background-color:#fff;'>" +
                "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
                "&nbsp;&nbsp;打印任务状态</div>" +
                "<a id='closePrintStatusDialog' style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:none;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='PrintCenter.hideDialog()'></a>" +
                "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
                "<div style='width: 90%; line-height: 20px; padding-left: 20px; font-size: 13px; margin-top: 5px;'>" +
                // "<div style='font-size:14px;font-weight:bold;'>" + (title ? title : "打印状态") + "</div>" +
                "<div style='padding-top:8px' id='printWindowContent'>" +
                "</div></div>" +
                //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
                "</div></div>");
            $("#printWindowContent").html(message);
        }
    }

    this.hideDialog = function () {
        _self.printingObj = new Object();
        _self.taskObject = new Object();
        _self.printingMap = new Object();
        $("#printStatusDialog").remove();
        if (_self.view && _self.view.get("#tip_loading_prt")) _self.view.get("#tip_loading_prt").hide();
    }

    this.showDetail = function (taskID) {
        var task = _self.taskObject[taskID];
        var taskDoc = task.documents;
        var content = "";
        for (var j = 0; j < taskDoc.length; j++) {
            var billNo = taskDoc[j].billNo;
            var expressUid = taskDoc[j].expressUid;
            var msg = taskDoc[j].msg;
            content += billNo + (msg != null && msg != '' ? ":" + msg : "") + "<br/>";
        }
        var x = window.event.clientX;
        var y = window.event.clientY;
        if (!_self.tip) {
            _self.tip = new dorado.widget.Tip({
                caption: "包含的单据",
                content: content,
                closeable: true
            });
        } else {
            _self.tip.set("content", content);
        }
        _self.tip.show({
            position: {
                left: x,
                top: y
            }
        });
        _self.tip.set("style", {
            zIndex: 999999
        });
    }

    this.loadJS = function (url, callback) {
        var script = document.createElement('script'), fn = callback || function () {
        };
        script.type = 'text/javascript';
        //IE
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    fn();
                }
            };
        } else {
            //其他浏览器
            script.onload = function () {
                fn();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}


/**
 * 菜鸟云打印调用
 * author harry
 */
var CainiaoPrint = new function () {
    var self = this;
    this.version = "1.0";
    this.CaiNiaoVersion = null;
    this.lastVersion = "0.4.7.0";
    this.printer_address = "localhost:13529";
    this.socket = null;
    this.defaultPrinter;
    this.operMode;
    this.hasOpen = false;
    this.isPreview = false;
    this.view;
    this.previewType = "pdf";// pdf/image如果是预览模式，是以pdf还是image方式预览，二选一，此属性不是必选，默认以pdf预览。
    this.printerList = new Array();//打印机列表
    this.PX_TO_PT = 0.75;//px转换为pt
    this.PT_TO_MM = 25.4 / 72;//pt转换为mm
    this.renderCallBack;
    this.renderTimeOutCallBack;
    this.timeOutId = null;
    this.isCloseId = null;
    this.randomP = null;
    this.time1;
    this.downloadUrl = "https://cloudprint.cainiao.com/cloudprint/client/CNPrintSetup.exe";
    this.wikiUrl = "http://wiki.hupun.com/pages/viewpage.action?pageId=9404555";
    this.ie11Wike = "http://wiki.hupun.com/pages/viewpage.action?pageId=10158477";
    this.firefoxWiki = "http://wiki.hupun.com/pages/viewpage.action?pageId=10158570";
    this.parentUrl = "http://localhost:8081/erp-web";

    /**
     * 初始化打印控件
     */
    this.init = function (view) {
        if (myBrowser() == "IE" || myBrowser() == "IE7" || myBrowser() == "IE8" || myBrowser() == "IE9" || myBrowser() == "IE10") {
            return;
        }
        self.view = view;
        self.doConnect();
    }

    this.hasConnected = function () {
        if (self.socket && self.socket.readyState == 1) {
            return true;
        } else {
            self.doConnect();
        }
        return false;
    }

    this.closeSocket = function () {
        self.socket.close();
    }

    /**
     * 连接打印机
     */
    this.doConnect = function () {
        if (self.socket && self.socket.readyState == 1) {
            return;
        }
        self.socket = new WebSocket('wss://' + self.printer_address);
        // 打开Socket
        self.socket.onopen = function (event) {
            console.log("Websocket准备就绪,连接到菜鸟控件成功");
            PrintCenter.hasOpen = true;
            self.hasOpen = true;
            setTimeout(function () {
                self.doGetPrinters();
                self.getAgentInfo();
            }, 1000);
            self.randomP = parseInt(10000000 * Math.random());
        };
        // 监听消息
        self.socket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            // console.log('cainaio onmessage', data)
            if ("getPrinters" == data.cmd) {
                //alert('打印机列表:' + JSON.stringify(data.printers));
                var printers = data.printers;
                if (printers.length > 0) {
                    var hasEmpty = false;
                    for (var i = 0; i < self.printerList.length; i++) {
                        var obj = self.printerList[i];
                        if (obj.key == "") hasEmpty = true;
                    }
                    if (!hasEmpty) {
                        self.printerList.push({
                            key: "",
                            value: ""
                        });
                    }
                    for (var i = printers.length; i > 0;) {
                        var printerName = printers[--i].name;
                        var hasPrinter = false;
                        for (var j = 0; j < self.printerList.length; j++) {
                            var obj = self.printerList[j];
                            if (obj.key == printerName) hasPrinter = true;
                        }
                        if (!hasPrinter) {
                            self.printerList.push({
                                key: printerName,
                                value: printerName
                            });
                        }
                    }
                } else {
                    self.alertBox(" ", "系统没有可用的打印机，请检查操作系统的设备与打印机");
                }
                self.defaultPrinter = data.defaultPrinter;
            } else if ("print" == data.cmd && self.isPreview) {
                if (data.status == "failed") {
                    self.alertBox(" ", JSON.stringify(data));
                    // clearTimeout(CainiaoPrint.timeOutId);
                } else {
                    if (self.previewType == "image") {
                        self.view.get("#previewPanel").show();
                        var images = data.previewImage;
                        for (var i = 0; i < images.length; i++) {
                            var url = images[i];
                            $("#picContainer").append("<img src='" + url + "' width='378px' height='684px'/></br>");
                        }
                    } else {
                        window.open(data.previewURL, "预览");
                    }
                }
                if (self.view) self.view.get("#tip_loading_prt").hide();
            } else if ("print" == data.cmd && !self.isPreview) {
                if (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) {
                    if (PrintCenter.updateStatusMode == 3 && data.status == "failed") {
                        self.alertBox(" ", JSON.stringify(data));
                    }
                    PrintCenter.refreshStatus(data);
                } else {
                    if (data.status == "success" && self.renderCallBack && data.taskID) {//&& data.taskID.indexOf("express_")>-1
                        self.renderCallBack(data, PrintCenter.printingMap);
                    } else if (data.status != "success" && self.renderCallBack && data.taskID) {//&& data.taskID.indexOf("express_")>-1
                        self.renderCallBack(data, PrintCenter.printingMap);
                        self.randomP = parseInt(10000000 * Math.random());
//	        		if(self.view) self.view.get("#tip_loading_prt").hide();
                        self.alertBox(" ", JSON.stringify(data));
//	        		clearTimeout(self.timeOutId);
//	        		clearTimeout(self.isCloseId);
                    } else if (data.status != "success") {
                        self.alertBox(" ", data.msg);
                        // clearTimeout(self.timeOutId);
                        // clearTimeout(self.isCloseId);
                    }
                }
            } else if ("notifyPrintResult" == data.cmd) {
                var printStatus = data.printStatus;
//	        	if(data.taskStatus == "print" && self.renderCallBack){
//	        		self.renderCallBack(printStatus,PrintCenter.printingMap);
//	        	}
                var msg = "以下单据打印失败：\n";
                var isFailed = false;
                for (var i = 0; i < printStatus.length; i++) {
                    var printStatu = printStatus[i];
                    var documentID = printStatus[i].documentID;
                    var obj = PrintCenter.printingObj;
                    if(obj != null){
                        if (printStatu.status != "success") {
                            var billNO = obj[documentID].billNo;
                            var expressUid = obj[documentID].expressUid;
                            isFailed = true;
                            if (expressUid != null && expressUid != '')
                                msg += "快递单" + expressUid + ":" + printStatu.msg + ";" + "\n";
                            else
                                msg += "单据" + billNO + ":" + printStatu.msg + ";" + "\n";
                        }
                    }else{
                        msg += printStatu.msg + ";" + "\n";
                    }
                }
                if (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) {
                    if (isFailed) self.alertBox(" ", msg);
                    PrintCenter.refreshStatus(data);
                } else if (isFailed) {
                    self.alertBox(" ", msg);
                    if (self.renderCallBack && data.taskID) {
                        self.renderCallBack(data, PrintCenter.printingMap);
                        self.randomP = parseInt(10000000 * Math.random());
                    }
                }
                PrintCenter.refreshSeriesPrintingTasks(data);
            } else if ("getAgentInfo" == data.cmd) {
                self.CaiNiaoVersion = data.version;
            } else if ("getTaskStatus" == data.cmd) {
                PrintCenter.getTaskStatusHandler(data);
            } else {
                if (data.status != "success") {
                    if (self.view) self.view.get("#tip_loading_prt").hide();
                    self.alertBox(" ", data.msg);
                    // clearTimeout(CainiaoPrint.timeOutId);
                }

            }
        };

        // 监听Socket的关闭
        self.socket.onclose = function (event) {
            self.hasOpen = false;
            if (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) {
                PrintCenter.onClose();
            }
            console.log("菜鸟打印控件已经被关闭！");
            if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
            // self.alertBox(" ","菜鸟打印控件已经被关闭！");
        }

        self.socket.onerror = function (event) {
            self.hasOpen = false;
            if (self.operMode == operModeList.preview || self.operMode == operModeList.print) {
                var data = JSON.parse(event.data);
                console.log("菜鸟打印控件发生错误:" + JSON.stringify(data));
                alert("菜鸟打印控件发生错误:" + JSON.stringify(data))
            }
        }
    }

    /***
     * 获取打印机列表
     */
    this.doGetPrinters = function () {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: "getPrinters"
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 返回打印机列表
     * @returns  array[{key:printerName, value:printerName}]
     */
    this.getPrinterList = function () {
        return self.printerList;
    }


    /***
     * 配置打印机协议
     */
    this.doPrinterConfig = function () {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: 'printerConfig'
        };
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 打印机配置
     */
    this.doSetPrinterConfig = function (printerName, offsetLeft, offsetTop, needUpLogo, needDownLogo, paperWidth, paperHeight, printLimit) {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: 'setPrinterConfig',
            printer: {
                name: printerName != null && printerName != "" ? printerName : self.defaultPrinter
            }
        };
        if (offsetLeft != null) {
            request.printer.horizontalOffset = offsetLeft;
        }
        if (offsetTop != null) {
            request.printer.verticalOffset = offsetTop;
        }
        if (needUpLogo != null) {
            request.printer.needTopLogo = needUpLogo;
        }
        if (needDownLogo != null) {
            request.printer.needBottomLogo = needDownLogo;
        }
        if (paperWidth != null && paperHeight != null) {
            request.printer.paperSize = {"width": Math.ceil(paperWidth), "height": Math.ceil(paperHeight)};
        }
        if (printLimit != null) {//强制无空边
            request.printer.forceNoPageMargins = printLimit;
        }
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 根据taskID查询打印任务
     */
    this.doGetTaskStatus = function (requestID, taskArr) {
        var random = parseInt(100000000 * Math.random()) + "";
        var request = {
            requestID: requestID != null && requestID != '' ? requestID : random,
            version: self.version,
            cmd: "getTaskStatus",
            taskID: taskArr
        };
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 根据面单号查询打印任务
     */
    this.doGetDocumentStatus = function (requestID, waybillNO) {
        var request = {
            requestID: requestID,
            version: self.version,
            cmd: "getDocumentStatus",
            documentIDs: [
                waybillNO
            ]
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 获取菜鸟控件版本号
     */
    this.getAgentInfo = function () {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: "getAgentInfo"
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 菜鸟控件是否需要升级
     */
    this.needUpdate = function () {
        var ver = self.CaiNiaoVersion;
        if (ver != null) {
            var nums = ver.split(".");
            var lasts = self.lastVersion.split(".");
            return self.needUp(nums, lasts, 0);
        }
        return true;
    }

    this.needUp = function (nums, lasts, i) {
        if (Number(nums[i]) > Number(lasts[i])) {
            return false;
        } else if (Number(nums[i]) < Number(lasts[i])) {
            return true;
        } else {
            if (i < nums.length - 1) {
                return self.needUp(nums, lasts, ++i);
            } else {
                return false;
            }
        }
    }

    this.doPrint = function (datas, reSend) {
        if (!self.hasConnected()) {
            self.alertBox();
            return;
        }
        // if(!reSend){
        //   PrintCenter.printingObj = new Object();
        //   PrintCenter.printingMap = new Object();
        //   PrintCenter.taskObject = new Object();
        // }
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var documents = data.task.documents;
            data.task.taskStatus = "sending";
            if (!self.isPreview && (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3)) {
                PrintCenter.taskObject[data.task.taskID] = data.task;
            }

            var arr = new Array();
            var billIDs = "";
            var billNos = "";
            for (var j = 0; j < documents.length; j++) {
                var obj = new Object();
                obj.billNo = documents[j].billNo;
                obj.billID = documents[j].documentID;
                arr.push(obj);
                PrintCenter.printingObj[documents[j].documentID] = obj;

                if (billIDs != "") billIDs += ",";
                billIDs += documents[j].documentID;
                if (billNos != "") billNos += ",";
                billNos += documents[j].billNo;
            }

            if (!self.isPreview) {
                PrintCenter.printingMap[data.task.taskID] = arr;
            }
            // let customArea = JSON.parse(JSON.stringify(data.task.documents[0].contents[1]))
            // console.log('cainiao customArea',customArea)
            // console.log('cainiao doPrint', data)
            self.socket.send(JSON.stringify(data));
            if (PrintCenter.updateStatusMode == 2 && !self.isPreview && PrintCenter.callback) {
                PrintCenter.callback(billIDs, billNos, "", 1, i == datas.length - 1);
            }
        }
        if ((PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) && !self.isPreview && !reSend) {
            PrintCenter.showProcess(PrintCenter.printingMap);
        }
    }

    this.alertBox = function (title, message) {
        var i = 0;
        if (!message) {
            message = "您是否已经安装打印组件？</br>";
            var href = "javascript:window.open('" + self.downloadUrl + "')";
            var target = "";
            if (myBrowser() == "FF") {
                href = self.downloadUrl;
                target = "target=\"_blank\"";
            }
            message += "<ul style='list-style-type:disc;margin-left:20px;line-height:25px;margin-top:5px;'><li style='list-style-type:disc;'>若还未安装，请<a " + target + " href=\"" + href + "\">点此下载安装</a>。安装完成后需要刷新页面才能使用。</li>";
            message += "<li style='list-style-type:disc;'>已经安装的，请先确认组件已经打开并正常运行：</li></ul>";
            message += "<div style='margin-left:25px;'>" + ++i + ".重启组件后再次尝试</br>"
            if (myBrowser() == "FF" || myBrowser().startsWith("IE")) {
                var isIE = false;
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    isIE = true;
                }
                if (isIE) {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/ie.gif' style='width:20px;height:20px;'/>&nbsp;IE11<a href='" + self.ie11Wike + "' target='_blank'>(点此查看教程)</a> </br>";
                } else {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/firefox.gif' style='width:20px;height:20px;'/>&nbsp;Firefox<a href='" + self.firefoxWiki + "' target='_blank'>(点此查看教程)</a> </br>";
                }
            }
            message += "<div style='padding-top:5px;'>" + ++i + ".若以上方法均无效，请点击右上角联系客服" + "</div>";
            message += "</div>";
        }

        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        $("body").remove("#printAlertCN").append("<div id='printAlertCN' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
            "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
            "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
            "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:120px;" +
            "width:500px;height:240px;z-index:999999;background-color:#fff;'>" +
            "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
            "&nbsp;&nbsp;提示</div>" +
            "<a style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:block;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='CainiaoPrint.hideAlertBox()'></a>" +
            "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
            "<div style='width: 90%; line-height: 20px; padding-left: 20px; font-size: 13px; margin-top: 5px;'>" +
            "<div style='font-size:14px;font-weight:bold;'>" + (title ? title : "抱歉，菜鸟打印组件连接失败了<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/49.gif'/>") + "</div>" +
            "<div style='padding-top:8px'>" + message +
            "</div></div>" +
            //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
            "</div></div>");
        if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
    }

    this.hideAlertBox = function () {
        $("#printAlertCN").remove();
    }

    this.printTimeOut = function () {
        if (self.view && self.view.get("#tip_loading_prt").get("visible") == true) {
            var obj = PrintCenter.printingMap;
            var uids = "";
            var salercptUids = "";
            var printSalercptUid = "";
            var taskArr = new Array();
            for (var taskID in obj) {
                taskArr.push(taskID + "");
            }
            self.doGetTaskStatus(taskArr);
            for (var taskID in obj) {
                var arr = obj[taskID];
                for (var j = 0; j < arr.length; j++) {
                    var o = arr[j];
                    var expressUid = o.expressUid;
                    var salercptUid = o.salercptUid;
                    if (printSalercptUid != "") printSalercptUid += ",";
                    printSalercptUid += salercptUid;
                    uids += expressUid;
                    if (j % 5 == 0) {
                        uids += ",\n";
                    } else {
                        uids += ",";
                    }
                }
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
            if (uids != null && uids != "")
                self.alertBox(" ", "打印超时，以下快递单没有打上打印标识，请检查打印标识和实际打印出纸是否一一对应：\n" + uids);
            if (self.renderTimeOutCallBack && data.taskID.indexOf("express_") > -1) {
                self.renderTimeOutCallBack(printSalercptUid);
            }

        }
        // clearTimeout(self.isCloseId);
    }

    this.isClosed = function (preview) {
        if (!self.socket || self.socket.readyState != 1) {
            var obj = PrintCenter.printingMap;
            var uids = "";
            for (var key in obj) {
                var arr = obj[key];
                for (var j = 0; j < arr.length; j++) {
                    var o = arr[j];
                    if (!o[key]) continue;
                    var expressUid = o[key].expressUid;
                    uids += expressUid;
                    if (i % 5 == 0) {
                        uids += ",\n";
                    } else {
                        uids += ",";
                    }
                }
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
            var msg = "打印控件链接失败";
            if (uids != null && uids != "") {
                msg += "以下快递单没有打上打印标识，请检查打印标识和实际打印出纸是否一一对应：\n" + uids;
            }
            self.alertBox(" ", msg);
            // clearTimeout(self.timeOutId);
        } else {
            self.isCloseId = setTimeout(function () {
                self.isClosed(preview);
            }, 5000);
        }
    }

}


/**
 * 拼多多云打印调用
 * author harry
 */
var PddCloudPrint = new function () {
    var self = this;
    this.version = "1.0";
    this.PddVersion = null;
    this.lastVersion = "0.4.7.0";
    this.printer_address = "127.0.0.1:18653";
    this.socket = null;
    this.defaultPrinter;
    this.operMode;
    this.hasOpen = false;
    this.isPreview = false;
    this.view;
    this.previewType = "pdf";// pdf/image如果是预览模式，是以pdf还是image方式预览，二选一，此属性不是必选，默认以pdf预览。
    this.printerList = new Array();//打印机列表
    this.PX_TO_PT = 0.75;//px转换为pt
    this.PT_TO_MM = 25.4 / 72;//pt转换为mm
    this.renderCallBack;
    this.renderTimeOutCallBack;
    this.timeOutId = null;
    this.isCloseId = null;
    this.randomP = null;
    this.time1;
    this.downloadUrl = "https://meta.pinduoduo.com/api/one/app/v1/lateststable?appId=com.xunmeng.pddprint&platform=windows&subType=main";
    this.wikiUrl = "http://wiki.hupun.com/pages/viewpage.action?pageId=9404555";
    this.ie11Wike = "http://wiki.hupun.com/pages/viewpage.action?pageId=10158477";
    this.firefoxWiki = "http://wiki.hupun.com/pages/viewpage.action?pageId=10158570";
    this.parentUrl = "http://localhost:8081/erp-web";

    /**
     * 初始化打印控件
     */
    this.init = function (view) {
        if (myBrowser() == "IE" || myBrowser() == "IE7" || myBrowser() == "IE8" || myBrowser() == "IE9" || myBrowser() == "IE10") {
            return;
        }
        self.view = view;
        self.doConnect();
    }

    this.hasConnected = function () {
        if (self.socket && self.socket.readyState == 1) {
            return true;
        } else {
            self.doConnect();
        }
        return false;
    }

    this.messageCallback = function (event) {
        var data = JSON.parse(event.data);
        //检查一下是否要打印日志
        if("PrintResultNotify" === data.cmd || "print" === data.cmd){
            var savePrintLog = sessionStorage['savePrintLog-'+data.taskID]
            if(savePrintLog && "y" === savePrintLog){
                //记录一下打印的日志 拼多多 打印回调
                self.saveSendLog(event.data);
                //存好以后 移除掉存储
                delete sessionStorage['savePrintLog-'+data.taskID]
            }
        }
        if ("getPrinters" == data.cmd) {
            //alert('打印机列表:' + JSON.stringify(data.printers));
            var printers = data.printers;
            if (printers.length > 0) {
                var hasEmpty = false;
                for (var i = 0; i < self.printerList.length; i++) {
                    var obj = self.printerList[i];
                    if (obj.key == "") hasEmpty = true;
                }
                if (!hasEmpty) {
                    self.printerList.push({
                        key: "",
                        value: ""
                    });
                }
                for (var i = printers.length; i > 0;) {
                    var printerName = printers[--i].name;
                    var hasPrinter = false;
                    for (var j = 0; j < self.printerList.length; j++) {
                        var obj = self.printerList[j];
                        if (obj.key == printerName) hasPrinter = true;
                    }
                    if (!hasPrinter) {
                        self.printerList.push({
                            key: printerName,
                            value: printerName
                        });
                    }
                }
            } else {
                self.alertBox(" ", "系统没有可用的打印机，请检查操作系统的设备与打印机");
            }
            self.defaultPrinter = data.defaultPrinter;
            //alert('默认打印机为:' + self.defaultPrinter);
            //self.doSetPrinterConfig(null,true,false,"vertical",false,1,1);
        } else if ("print" == data.cmd && self.isPreview) {
            if (data.status == "failed") {
                self.alertBox(" ", JSON.stringify(data));
                // clearTimeout(CainiaoPrint.timeOutId);
            } else {
                if (self.previewType == "image") {
                    if (self.view) self.view.get("#previewPanel").show();
                    var images = data.previewImage;
                    for (var i = 0; i < images.length; i++) {
                        var url = images[i];
                        $("#picContainer").append("<img src='" + url + "' width='378px' height='684px'/></br>");
                    }
                } else {
                    if (data.previewURL != null && data.previewURL != '') window.open(data.previewURL, "预览");
                }
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
        } else if ("PrintResultNotify" == data.cmd && self.isPreview && data.taskStatus == "printed") {
            if (data.previewURL != null && data.previewURL != '') window.open(data.previewURL, "预览");
            if (self.view) self.view.get("#tip_loading_prt").hide();
        } else if ("print" == data.cmd && !self.isPreview) {
            if (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) {
                if (PrintCenter.updateStatusMode == 3 && data.status != "success") {
                    self.alertBox(" ", JSON.stringify(data));
                }
                PrintCenter.refreshStatus(data);
            } else {
                if (data.status == "success" && self.renderCallBack && data.taskID) {//&& data.taskID.indexOf("express_")>-1
                    self.renderCallBack(data, PrintCenter.printingMap);
                } else if (data.status != "success" && self.renderCallBack && data.taskID) {//&& data.taskID.indexOf("express_")>-1
                    self.renderCallBack(data, PrintCenter.printingMap);
                    self.randomP = parseInt(10000000 * Math.random());
//        		if(self.view) self.view.get("#tip_loading_prt").hide();
                    self.alertBox(" ", JSON.stringify(data));
//        		clearTimeout(self.timeOutId);
//        		clearTimeout(self.isCloseId);
                } else if (data.status != "success") {
                    if (self.view) self.view.get("#tip_loading_prt").hide();
                    self.alertBox(" ", data.msg);
                    // clearTimeout(self.timeOutId);
                    // clearTimeout(self.isCloseId);
                }
            }
        } else if ("PrintResultNotify" == data.cmd) {
            var printStatus = data.printStatus;
//        	if(data.taskStatus == "print" && self.renderCallBack){
//        		self.renderCallBack(printStatus,PrintCenter.printingMap);
//        	}
            if(self.isPreview && data.taskStatus == "failed"){
                self.alertBox(" ", "预览失败");
                return;
            }
            var msg = "以下单据打印失败：\n";
            var isFailed = false;
            if(printStatus != null){
                for (var i = 0; i < printStatus.length; i++) {
                    var printStatu = printStatus[i];
                    var documentID = printStatus[i].documentID;
                    var obj = PrintCenter.printingObj;
                    if (obj != null && printStatu.status != "success") {
                        var billNO = obj[documentID].billNo;
                        var expressUid = obj[documentID].expressUid;
                        isFailed = true;
                        if (expressUid != null && expressUid != '')
                            msg += "快递单" + expressUid + ":" + printStatu.msg + ";" + "\n";
                        else
                            msg += "单据" + billNO + ":" + printStatu.msg + ";" + "\n";
                    }
                }
            } else if(data.taskStatus == "failed"){
                isFailed = true;
                msg += data.taskID + "，打印失败";
            }

            if (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) {
                if (isFailed) self.alertBox(" ", msg);
                PrintCenter.refreshStatus(data);
            } else if (isFailed) {
                if (self.view) self.view.get("#tip_loading_prt").hide();
                self.alertBox(" ", msg);
                //clearTimeout(CainiaoPrint.timeOutId);
                if (data.taskID.indexOf("express_") > -1) {
                    self.renderCallBack(data, PrintCenter.printingMap);
                    self.randomP = parseInt(10000000 * Math.random());
                }
            }
            PrintCenter.refreshSeriesPrintingTasks(data);
        } else if ("getTaskStatus" == data.cmd) {
            PrintCenter.getTaskStatusHandler(data);
        } else if ("getAppInfo" == data.cmd) {
            self.PddVersion = data.AppVersion;
        } else {
            if (data.status != "success") {
                if (self.view) self.view.get("#tip_loading_prt").hide();
                self.alertBox(" ", data.msg);
                // clearTimeout(CainiaoPrint.timeOutId);
            }

        }
    }

    /**
     * 连接打印机
     */
    this.doConnect = function () {
        if (self.socket && self.socket.readyState == 1) {
            return;
        }
        self.socket = new WebSocket('wss://' + self.printer_address);
        // 打开Socket
        self.socket.onopen = function (event) {
            console.log("Websocket准备就绪,连接到拼多多控件成功");
            self.hasOpen = true;
            PrintCenter.hasOpen = true;
            setTimeout(function () {
                self.doGetPrinters();
                self.getAgentInfo();
            }, 1000);
            self.randomP = parseInt(10000000 * Math.random());
        };
        // 监听消息
        self.socket.onmessage = self.messageCallback;

        // 监听Socket的关闭
        self.socket.onclose = function (event) {
            self.hasOpen = false;
            if (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) {
                PrintCenter.onClose();
            }
            console.log("拼多多打印控件已经被关闭！");
            if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
        }

        self.socket.onerror = function (event) {
            self.hasOpen = false;
            if (self.operMode == operModeList.preview || self.operMode == operModeList.print) {
                var data = JSON.parse(event.data);
                alert("菜鸟打印控件发生错误:" + JSON.stringify(data))
            }
        }
    }

    /***
     * 获取打印机列表
     */
    this.doGetPrinters = function () {
        var random = parseInt(100000000 * Math.random()) + "";
        ;
        var request = {
            "cmd": "getPrinters",
            "requestID": random + "",
            "version": self.version
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 返回打印机列表
     * @returns  array[{key:printerName, value:printerName}]
     */
    this.getPrinterList = function () {
        return self.printerList;
    }


    /***
     * 配置打印机协议
     */
    this.doPrinterConfig = function () {
        var random = parseInt(100000000 * Math.random()) + "";
        ;
        var request = {
            requestID: random,
            version: self.version,
            cmd: 'printerConfig'
        };
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 打印机配置
     */
    this.doSetPrinterConfig = function (printerName, offsetLeft, offsetTop, needUpLogo, needDownLogo, paperWidth, paperHeight) {
        var random = parseInt(100000000 * Math.random()) + "";
        var request = {
            requestID: random,
            version: self.version,
            cmd: 'setPrinterConfig',
            printer: {
                name: printerName != null && printerName != "" ? printerName : self.defaultPrinter
            }
        };
        if (offsetLeft != null) {
            request.printer.horizontalOffset = offsetLeft;
        } else {
            request.printer.horizontalOffset = 0;
        }
        if (offsetTop != null) {
            request.printer.verticalOffset = offsetTop;
        } else {
            request.printer.verticalOffset = 0;
        }
        if (needUpLogo != null) {
            request.printer.PrintTopLogo = needUpLogo;
        }
        if (needDownLogo != null) {
            request.printer.PrintBottomLogo = needDownLogo;
        }
        if (paperWidth != null && paperHeight != null) {
            request.printer.paperSize = {"width": Math.ceil(paperWidth), "height": Math.ceil(paperHeight)};
        }
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 根据taskID查询打印任务
     */
    this.doGetTaskStatus = function (requestID, printTaskId) {
        var request = {
            requestID: requestID,
            version: self.version,
            cmd: "getTaskStatus",
            taskID: [
                '' + printTaskId
            ]
        };
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 根据面单号查询打印任务
     */
    this.doGetDocumentStatus = function (requestID, waybillNO) {
        var request = {
            requestID: requestID,
            version: self.version,
            cmd: "getDocumentStatus",
            documentIDs: [
                waybillNO
            ]
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 获取菜鸟控件版本号
     */
    this.getAgentInfo = function () {
        var random = parseInt(100000000 * Math.random()) + "";
        ;
        var request = {
            requestID: random + "",
            version: self.version,
            cmd: "getAppInfo"
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 菜鸟控件是否需要升级
     */
    this.needUpdate = function () {
        var ver = self.PddVersion;
        if (ver != null) {
            var nums = ver.split(".");
            var lasts = self.lastVersion.split(".");
            return self.needUp(nums, lasts, 0);
        }
        return true;
    }

    this.needUp = function (nums, lasts, i) {
        if (Number(nums[i]) > Number(lasts[i])) {
            return false;
        } else if (Number(nums[i]) < Number(lasts[i])) {
            return true;
        } else {
            if (i < nums.length - 1) {
                return self.needUp(nums, lasts, ++i);
            } else {
                return false;
            }
        }
    }

    this.doPrint = function (datas, reSend) {
        if (!self.hasConnected()) {
            self.alertBox();
            return;
        }
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var documents = data.task.documents;
            data.task.taskStatus = "sending";
            if (!self.isPreview && (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3)) {
                PrintCenter.taskObject[data.task.taskID] = data.task;
            }

            var arr = new Array();
            var billIDs = "";
            var billNos = "";
            for (var j = 0; j < documents.length; j++) {
                var obj = new Object();
                obj.billNo = documents[j].billNo;
                obj.billID = documents[j].documentID;
                if (!self.isPreview) {
                    PrintCenter.printingObj[documents[j].documentID] = obj;
                }
                arr.push(obj);

                if (billIDs != "") billIDs += ",";
                billIDs += documents[j].documentID;
                if (billNos != "") billNos += ",";
                billNos += documents[j].billNo;
            }

            if (!self.isPreview) {
                PrintCenter.printingMap[data.task.taskID] = arr;
            }

            var dataString = JSON.stringify(data);
            self.socket.send(dataString);
            //记录一下打印的日志 拼多多 发送打印
            if(data.savePrintLog && data.savePrintLog===1){
                //临时存一下哪些任务id要保存日志
                sessionStorage['savePrintLog-'+data.task.taskID]="y"
                self.saveSendLog(dataString);
            }
            if (PrintCenter.updateStatusMode == 2 && !self.isPreview && PrintCenter.callback) {
                PrintCenter.callback(billIDs, billNos, "", 1, i == datas.length - 1);
            }
        }
        if ((PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) && !self.isPreview && !reSend) {
            PrintCenter.showProcess(PrintCenter.printingMap);
        }
    }

    this.saveSendLog = function(dataString){
        // console.log('saveSendLog',dataString);
        if(!self.view){
            return;
        }
        try {
            var ajaxAction = self.view.get("#savePrinterLogger");
            if(ajaxAction){
                ajaxAction.set("parameter", dataString).execute(function (result) {
                    console.log("[PDD] 保存打印日志完成",result)
                });
            }
        } catch (e) {
            console.log("[PDD] 保存打印日志失败 ",e)
        }
    }

    this.alertBox = function (title, message) {
        // if (message != null && dorado != null) {
        //     dorado.MessageBox.alert(message);
        //     if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
        //     return;
        // }
        var i = 0;
        if (!message) {
            message = "您是否已经安装打印组件？</br>";
            var href = "javascript:window.open('" + self.downloadUrl + "')";
            var target = "";
            if (myBrowser() == "FF") {
                href = self.downloadUrl;
                target = "target=\"_blank\"";
            }
            message += "<ul style='list-style-type:disc;margin-left:20px;line-height:25px;margin-top:5px;'><li style='list-style-type:disc;'>若还未安装，请<a " + target + " href=\"" + href + "\">点此下载安装</a>。安装完成后需要刷新页面才能使用。</li>";
            message += "<li style='list-style-type:disc;'>已经安装的，请先确认组件已经打开并正常运行：</li></ul>";
            message += "<div style='margin-left:25px;'>" + ++i + ".重启组件后再次尝试</br>"
            if (myBrowser() == "FF" || myBrowser().startsWith("IE")) {
                var isIE = false;
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    isIE = true;
                }
                if (isIE) {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/ie.gif' style='width:20px;height:20px;'/>&nbsp;IE11<a href='" + self.ie11Wike + "' target='_blank'>(点此查看教程)</a> </br>";
                } else {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/firefox.gif' style='width:20px;height:20px;'/>&nbsp;Firefox<a href='" + self.firefoxWiki + "' target='_blank'>(点此查看教程)</a> </br>";
                }
            }
            message += "<div style='padding-top:5px;'>" + ++i + ".若以上方法均无效，请点击右上角联系客服" + "</div>";
            message += "</div>";
        }

        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        $("body").remove("#printAlertPdd").append("<div id='printAlertPdd' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
            "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
            "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
            "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:120px;" +
            "width:500px;height:240px;z-index:999999;background-color:#fff;'>" +
            "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
            "&nbsp;&nbsp;提示</div>" +
            "<a style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:block;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='PddCloudPrint.hideAlertBox()'></a>" +
            "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
            "<div style='width: 90%; line-height: 20px; padding-left: 20px; font-size: 13px; margin-top: 5px;'>" +
            "<div style='font-size:14px;font-weight:bold;'>" + (title ? title : "抱歉，拼多多打印组件连接失败了<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/49.gif'/>") + "</div>" +
            "<div style='padding-top:8px'>" + message +
            "</div></div>" +
            //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
            "</div></div>");
        if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
    }

    this.hideAlertBox = function () {
        $("#printAlertPdd").remove();
    }

    this.printTimeOut = function () {
        if (self.view && self.view.get("#tip_loading_prt").get("visible") == true) {
            var obj = PrintCenter.printingMap;
            var uids = "";
            var salercptUids = "";
            var printSalercptUid = "";
            for (var key in obj) {
                var arr = obj[key];
                for (var j = 0; j < arr.length; j++) {
                    var o = arr[j];
                    var expressUid = o.expressUid;
                    var salercptUid = o.salercptUid;
                    if (printSalercptUid != "") printSalercptUid += ",";
                    printSalercptUid += salercptUid;
                    uids += expressUid;
                    if (j % 5 == 0) {
                        uids += ",\n";
                    } else {
                        uids += ",";
                    }
                }
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
            if (uids != null && uids != "")
                self.alertBox(" ", "打印超时，以下快递单没有打上打印标识，请检查打印标识和实际打印出纸是否一一对应：\n" + uids);
            if (self.renderTimeOutCallBack && data.taskID.indexOf("express_") > -1) {
                self.renderTimeOutCallBack(printSalercptUid);
            }

        }
        // clearTimeout(self.isCloseId);
    }

    this.isClosed = function (preview) {
        if (!self.socket || self.socket.readyState != 1) {
            var obj = PrintCenter.printingMap;
            var uids = "";
            for (var key in obj) {
                var arr = obj[key];
                for (var j = 0; j < arr.length; j++) {
                    var o = arr[j];
                    if (!o[key]) continue;
                    var expressUid = o[key].expressUid;
                    uids += expressUid;
                    if (i % 5 == 0) {
                        uids += ",\n";
                    } else {
                        uids += ",";
                    }
                }
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
            var msg = "打印控件链接失败";
            if (uids != null && uids != "") {
                msg += "以下快递单没有打上打印标识，请检查打印标识和实际打印出纸是否一一对应：\n" + uids;
            }
            self.alertBox(" ", msg);
            // clearTimeout(self.timeOutId);
        } else {
            self.isCloseId = setTimeout(function () {
                self.isClosed(preview);
            }, 5000);
        }
    }

}


/**
 * 云集打印控件调用
 */
var YunJiCloudPrint = new function () {
    var self = this;
    this.printer_address = "localhost:56322";
    this.randomP;
    this.defaultPrinter;
    this.printerList = new Array();//打印机列表
    this.renderCallBack;
    this.view;
    this.requestID;

    /**
     * 初始化打印控件
     */
    this.init = function (view) {
        if (myBrowser() == "IE" || myBrowser() == "IE7" || myBrowser() == "IE8" || myBrowser() == "IE9" || myBrowser() == "IE10") {
            return;
        }
        self.view = view;
        self.doConnect();
    }

    /**
     * 连接打印机
     */
    this.doConnect = function () {
        if (self.socket && self.socket.readyState == 1) {
            return;
        }
        self.socket = new WebSocket('ws://' + self.printer_address);
        // 打开Socket
        self.socket.onopen = function (event) {
            console.log("Websocket准备就绪,连接到云集客户端成功")
            //alert("Websocket准备就绪,连接到客户端成功");
            self.hasOpen = true;
            self.doGetPrinters();
            self.randomP = parseInt(10000000 * Math.random());
        };
        // 监听消息
        self.socket.onmessage = self.messageCallback;

        // 监听Socket的关闭
        self.socket.onclose = function (event) {
            self.hasOpen = false;
            console.log("云集打印控件socket链接已经被关闭!");
            //self.alertBox("云集打印控件已经被关闭！");
        }

        self.socket.onerror = function (event) {
            self.hasOpen = false;
            if (self.operMode == operModeList.preview
                || self.operMode == operModeList.print) {
                var data = JSON.parse(event.data);
                alert("云集打印控件发生错误:" + JSON.stringify(data))
            }
        }
    }

    this.messageCallback = function (event) {
        var data = JSON.parse(event.data);
        if ("PRINTER_LIST_CALLBACK" == data.cmd) {
            var printers = data.list;
            if (printers.length > 0) {
                var hasEmpty = false;
                for (var i = 0; i < self.printerList.length; i++) {
                    var obj = self.printerList[i];
                    if (obj.key == "")
                        hasEmpty = true;
                }
                if (!hasEmpty) {
                    self.printerList.push({
                        key: "",
                        value: ""
                    });
                }
                for (var i = printers.length; i > 0;) {
                    var printerName = printers[--i].name;
                    if (printers[--i].isDefault) {
                        self.defaultPrinter = printerName;
                    }
                    var hasPrinter = false;
                    for (var j = 0; j < self.printerList.length; j++) {
                        var obj = self.printerList[j];
                        if (obj.key == printerName)
                            hasPrinter = true;
                    }
                    if (!hasPrinter) {
                        self.printerList.push({
                            key: printerName,
                            value: printerName
                        });
                    }
                }
            } else {
                self.alertBox(" ", "系统没有可用的打印机，请检查操作系统的设备与打印机");
            }
        } else if ("PRINT_TASK_CALLBACK" == data.cmd) {
            if (data.code == 0 && self.renderCallBack) {
                console.log(data);
                self.convertReslut(data);
            } else if (data.code != 0 && self.renderCallBack) {
                self.convertReslut(data);
                self.randomP = parseInt(10000000 * Math.random());
                //	        		if(self.view) self.view.get("#tip_loading_prt").hide();
                console.log(data);
                self.alertBox(" ", "打印失败：" + data.msg);
                //	        		clearTimeout(self.timeOutId);
                //	        		clearTimeout(self.isCloseId);
            } else if (data.code != 0) {
                if (self.view)
                    self.view.get("#tip_loading_prt").hide();
                console.log(data);
                self.alertBox(" ", "打印失败：" + data.msg);
                // clearTimeout(self.timeOutId);
                // clearTimeout(self.isCloseId);
            }
        }

    }

    this.convertReslut = function (data) {
        var json = new Object();
        json.taskID = self.requestID;
        json.cmd = "print";
        json.status = data.code == 0 ? "success" : "failed";
        self.renderCallBack(json, PrintCenter.printingMap);
    }

    this.hasConnected = function () {
        if (self.socket && self.socket.readyState == 1) {
            return true;
        } else {
            self.doConnect();
        }
        return false;
    }

    /***
     * 获取打印机列表
     */
    this.doGetPrinters = function () {
        var request = {
            "method": "getPrinter"
        };
        self.socket.send(JSON.stringify(request));
    }

    this.doPrint = function (datas) {
        if (!self.hasConnected()) {
            self.alertBox();
            return;
        }
        var arr = new Array();
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var documents = data.params;

            var billIDs = "";
            var billNos = "";
            for (var j = 0; j < documents.length; j++) {
                var obj = new Object();
                obj.billNo = documents[j].billNo;
                obj.billID = documents[j].taskCode;
                if (!self.isPreview) {
                    PrintCenter.printingObj[documents[j].taskCode] = obj;
                }
                arr.push(obj);

                if (billIDs != "") billIDs += ",";
                billIDs += documents[j].documentID;
                if (billNos != "") billNos += ",";
                billNos += documents[j].billNo;
            }

            self.socket.send(JSON.stringify(data));
            if (PrintCenter.updateStatusMode == 2 && !self.isPreview && PrintCenter.callback) {
                PrintCenter.callback(billIDs, billNos, "", 1, i == datas.length - 1);
            }
        }
        if (!self.isPreview) {
            PrintCenter.printingMap[data.requestID] = arr;
        }
        self.requestID = data.requestID;
    }

    this.alertBox = function (title, message) {
        var i = 0;
        if (!message) {
            message = "您是否已经安装打印组件？</br>";
            var href = "javascript:window.open('" + self.downloadUrl + "')";
            var target = "";
            if (myBrowser() == "FF") {
                href = self.downloadUrl;
                target = "target=\"_blank\"";
            }
            message += "<ul style='list-style-type:disc;margin-left:20px;line-height:25px;margin-top:5px;'><li style='list-style-type:disc;'>若还未安装，请<a " + target + " href=\"" + href + "\">点此下载安装</a>。安装完成后需要刷新页面才能使用。</li>";
            message += "<li style='list-style-type:disc;'>已经安装的，请先确认组件已经打开并正常运行：</li></ul>";
            message += "<div style='margin-left:25px;'>" + ++i + ".重启组件后再次尝试</br>"
            if (myBrowser() == "FF" || myBrowser().startsWith("IE")) {
                var isIE = false;
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    isIE = true;
                }
                if (isIE) {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/ie.gif' style='width:20px;height:20px;'/>&nbsp;IE11<a href='" + self.ie11Wike + "' target='_blank'>(点此查看教程)</a> </br>";
                } else {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/firefox.gif' style='width:20px;height:20px;'/>&nbsp;Firefox<a href='" + self.firefoxWiki + "' target='_blank'>(点此查看教程)</a> </br>";
                }
            }
            message += "<div style='padding-top:5px;'>" + ++i + ".若以上方法均无效，请点击右上角联系客服" + "</div>";
            message += "</div>";
        }

        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        $("body").remove("#printAlertYj").append("<div id='printAlertYj' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
            "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
            "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
            "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:120px;" +
            "width:500px;height:240px;z-index:999999;background-color:#fff;'>" +
            "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
            "&nbsp;&nbsp;提示</div>" +
            "<a style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:block;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='CainiaoPrint.hideAlertBox()'></a>" +
            "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
            "<div style='width: 90%; line-height: 20px; padding-left: 20px; font-size: 13px; margin-top: 5px;'>" +
            "<div style='font-size:14px;font-weight:bold;'>" + (title ? title : "抱歉，云集打印组件连接失败了<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/49.gif'/>") + "</div>" +
            "<div style='padding-top:8px'>" + message +
            "</div></div>" +
            //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
            "</div></div>");
    }

}


/**
 * 京东打印控件调用
 */
var JDCloudPrint = new function () {
    var self = this;
    this.printer_address = "localhost:9113";
    this.randomP;
    this.defaultPrinter;
    this.printerList = new Array();//打印机列表
    this.renderCallBack;
    this.view;
    this.requestID;
    this.downloadUrl = "https://prod-oms-app-cprt.jdwl.com/OpenCloudPrint/setup.zip";
    this.printMapJD = new Object();
    this.printingObjJD = new Object();

    /**
     * 初始化打印控件
     */
    this.init = function (view) {
        if (myBrowser() == "IE" || myBrowser() == "IE7" || myBrowser() == "IE8" || myBrowser() == "IE9" || myBrowser() == "IE10") {
            return;
        }
        self.view = view;
        self.doConnect();
    }

    /**
     * 连接打印机
     */
    this.doConnect = function () {
        if (self.socket && self.socket.readyState == 1) {
            return;
        }
        self.socket = new WebSocket('ws://' + self.printer_address);
        // 打开Socket
        self.socket.onopen = function (event) {
            console.log("Websocket准备就绪,连接到京东打印控件成功")
            //alert("Websocket准备就绪,连接到客户端成功");
            self.hasOpen = true;
            self.doGetPrinters();
            self.randomP = parseInt(10000000 * Math.random());
        };
        // 监听消息
        self.socket.onmessage = self.messageCallback;

        // 监听Socket的关闭
        self.socket.onclose = function (event) {
            self.hasOpen = false;
            console.log("京东打印控件socket链接已经被关闭!");
            //self.alertBox("云集打印控件已经被关闭！");
        }

        self.socket.onerror = function (event) {
            self.hasOpen = false;
            if (self.operMode == operModeList.preview
                || self.operMode == operModeList.print) {
                var data = JSON.parse(event.data);
                alert("京东打印控件发生错误:" + JSON.stringify(data))
            }
        }
    }

    this.messageCallback = function (event) {
        var data = JSON.parse(event.data);
        if ("6" == data.code && "true" == data.success && (data.content != null || data.detailinfo != null)) {
            var printers = data.detailinfo.printers;//data.content.split(",");
            if (printers.length > 0) {
                var hasEmpty = false;
                for (var i = 0; i < self.printerList.length; i++) {
                    var obj = self.printerList[i];
                    if (obj.key == "")
                        hasEmpty = true;
                }
                if (!hasEmpty) {
                    self.printerList.push({
                        key: "",
                        value: ""
                    });
                }
                for (var i = printers.length; i > 0;) {
                    var printerName = printers[--i];
                    // if (printers[--i].isDefault) {
                    //   self.defaultPrinter = printerName;
                    // }
                    var hasPrinter = false;
                    for (var j = 0; j < self.printerList.length; j++) {
                        var obj = self.printerList[j];
                        if (obj.key == printerName)
                            hasPrinter = true;
                    }
                    if (!hasPrinter) {
                        self.printerList.push({
                            key: printerName,
                            value: printerName
                        });
                    }
                }
            } else {
                self.alertBox(" ", "系统没有可用的打印机，请检查操作系统的设备与打印机");
            }
        } else if ("2" == data.code) {
            if (data.success == "true" && self.renderCallBack) {
                console.log(data);
                if (PrintCenter.updateStatusMode != 2) {
                    self.convertReslut(data);
                }
            } else if (data.success != "true" && self.renderCallBack) {
                self.convertReslut(data);
                self.randomP = parseInt(10000000 * Math.random());
                //	        		if(self.view) self.view.get("#tip_loading_prt").hide();
                console.log(data);
                self.alertBox(" ", "打印失败：" + data.message);
                //	        		clearTimeout(self.timeOutId);
                //	        		clearTimeout(self.isCloseId);
            } else if (data.success != "true") {
                if (self.view)
                    self.view.get("#tip_loading_prt").hide();
                console.log(data);
                self.alertBox(" ", "打印失败：" + data.message);
                // clearTimeout(self.timeOutId);
                // clearTimeout(self.isCloseId);
            }
        } else if ("8" == data.code) {
            if (data.success == "true" && data.detailinfo != null) {
                var base = data.detailinfo.imgdata;
                self.showPreview(base);
            } else {
                self.alertBox(" ", "打印预览失败：" + data.message);
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
        } else if ("9" == data.code) {
            if (data.success == "true" && data.detailinfo != null) {
                var base = data.detailinfo.imgdata;
                self.showPreview(base);
            } else {
                self.alertBox(" ", "打印预览失败：" + data.message);
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
        }
    }

    this.convertReslut = function (data) {
        var json = new Object();
        json.taskID = data.key;
        json.cmd = "print";
        json.status = data.success == "true" ? "success" : "failed";
        self.renderCallBack(json, self.printMapJD);
        PrintCenter.refreshSeriesPrintingTasks(json);
    }

    this.hasConnected = function () {
        if (self.socket && self.socket.readyState == 1) {
            return true;
        } else {
            self.doConnect();
        }
        return false;
    }

    /***
     * 获取打印机列表
     */
    this.doGetPrinters = function () {
        var request = {
            "orderType": "GET_Printers"
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 返回打印机列表
     * @returns  array[{key:printerName, value:printerName}]
     */
    this.getPrinterList = function () {
        return self.printerList;
    }

    this.doPrint = function (datas, reSend) {
        if (!self.hasConnected()) {
            self.alertBox();
            if (self.view) self.view.get("#tip_loading_prt").hide();
            return;
        }

        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var documents = data.task.documents;

            var arr = new Array();
            var billIDs = "";
            var billNos = "";
            for (var j = 0; j < documents.length; j++) {
                var obj = new Object();
                obj.billNo = documents[j].billNo;
                obj.billID = documents[j].documentID;
                arr.push(obj);
                self.printingObjJD[documents[j].documentID] = obj;

                if (billIDs != "") billIDs += ",";
                billIDs += documents[j].documentID;
                if (billNos != "") billNos += ",";
                billNos += documents[j].billNo;
            }

            if (!self.isPreview) {
                self.printMapJD[data.key] = arr;
            }
            try {
                delete data.parameters.addData;
            } catch (e) {
            }
            var request = {
                "orderType": data.orderType,
                "key": data.key,
                "parameters": data.parameters
            }
            self.socket.send(JSON.stringify(request));
            if (PrintCenter.updateStatusMode == 2 && !self.isPreview && PrintCenter.callback) {
                PrintCenter.callback(billIDs, billNos, "", 1, i == datas.length - 1);
            }
        }

    }

    this.hideAlertBox = function () {
        $("#printAlertJD").remove();
    }

    this.alertBox = function (title, message) {
        var i = 0;
        if (!message) {
            message = "您是否已经安装打印组件？</br>";
            var href = "javascript:window.open('" + self.downloadUrl + "')";
            var target = "";
            if (myBrowser() == "FF") {
                href = self.downloadUrl;
                target = "target=\"_blank\"";
            }
            message += "<ul style='list-style-type:disc;margin-left:20px;line-height:25px;margin-top:5px;'><li style='list-style-type:disc;'>若还未安装，请<a " + target + " href=\"" + href + "\">点此下载安装</a>。安装完成后需要刷新页面才能使用。</li>";
            message += "<li style='list-style-type:disc;'>已经安装的，请先确认组件已经打开并正常运行：</li></ul>";
            message += "<div style='margin-left:25px;'>" + ++i + ".重启组件后再次尝试</br>"
            if (myBrowser() == "FF" || myBrowser().startsWith("IE")) {
                var isIE = false;
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    isIE = true;
                }
                if (isIE) {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/ie.gif' style='width:20px;height:20px;'/>&nbsp;IE11<a href='" + self.ie11Wike + "' target='_blank'>(点此查看教程)</a> </br>";
                } else {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/firefox.gif' style='width:20px;height:20px;'/>&nbsp;Firefox<a href='" + self.firefoxWiki + "' target='_blank'>(点此查看教程)</a> </br>";
                }
            }
            message += "<div style='padding-top:5px;'>" + ++i + ".若以上方法均无效，请点击右上角联系客服" + "</div>";
            message += "</div>";
        }

        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        $("body").remove("#printAlertJD").append("<div id='printAlertJD' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
            "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
            "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
            "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:120px;" +
            "width:500px;height:240px;z-index:999999;background-color:#fff;'>" +
            "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
            "&nbsp;&nbsp;提示</div>" +
            "<a style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:block;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='JDCloudPrint.hideAlertBox()'></a>" +
            "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
            "<div style='width: 90%; line-height: 20px; padding-left: 20px; font-size: 13px; margin-top: 5px;'>" +
            "<div style='font-size:14px;font-weight:bold;'>" + (title ? title : "抱歉，京东打印组件连接失败了<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/49.gif'/>") + "</div>" +
            "<div style='padding-top:8px'>" + message +
            "</div></div>" +
            //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
            "</div></div>");
    }

    this.showPreview = function (content) {
        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        $("body").remove("#printPreviewJD").append("<div id='printPreviewJD' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
            "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
            "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
            "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:10px;" +
            "width:500px;height:600px;z-index:999999;background-color:#fff;'>" +
            "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
            "&nbsp;&nbsp;预览</div>" +
            "<a style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:block;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='JDCloudPrint.hidePreview()'></a>" +
            "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
            "<div style='padding-top:8px;overflow:auto;height:560px;width:500px;'><img style='max-width:495px;' src='data:image/png;base64," + content + "'/>" +
            "</div>" +
            //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
            "</div></div>");
    }


    this.hidePreview = function () {
        $("#printPreviewJD").remove();
    }

}

/**
 * 抖音打印控件调用
 * author harry
 */
var DoudianPrint = new function () {
    var self = this;
    this.version = "1.0";
    this.CaiNiaoVersion = null;
    this.lastVersion = "1.0.0.6";
    this.printer_address = "localhost:13888";
    this.socket = null;
    this.defaultPrinter;
    this.operMode;
    this.hasOpen = false;
    this.isPreview = false;
    this.view;
    this.previewType = "pdf";// pdf/image如果是预览模式，是以pdf还是image方式预览，二选一，此属性不是必选，默认以pdf预览。
    this.printerList = new Array();//打印机列表
    this.PX_TO_PT = 0.75;//px转换为pt
    this.PT_TO_MM = 25.4 / 72;//pt转换为mm
    this.renderCallBack;
    this.renderTimeOutCallBack;
    this.timeOutId = null;
    this.isCloseId = null;
    this.randomP = null;
    this.time1;
    this.downloadUrl = "https://logistics.douyinec.com/davinci/CloudPrintClient";
    this.ie11Wike = "http://wiki.hupun.com/pages/viewpage.action?pageId=10158477";
    this.firefoxWiki = "http://wiki.hupun.com/pages/viewpage.action?pageId=10158570";
    this.printingMapDy = new Object();
    this.printingObjDy = new Object();

    /**
     * 初始化打印控件
     */
    this.init = function (view) {
        if (myBrowser() == "IE" || myBrowser() == "IE7" || myBrowser() == "IE8" || myBrowser() == "IE9" || myBrowser() == "IE10") {
            return;
        }
        self.view = view;
        self.doConnect();
    }

    this.hasConnected = function () {
        if (self.socket && self.socket.readyState == 1) {
            return true;
        } else {
            self.doConnect();
        }
        return false;
    }

    this.closeSocket = function () {
        self.socket.close();
    }

    /**
     * 连接打印机
     */
    this.doConnect = function () {
        if (self.socket && self.socket.readyState == 1) {
            return;
        }
        self.socket = new WebSocket('ws://' + self.printer_address);
        // 打开Socket
        self.socket.onopen = function (event) {
            console.log("Websocket准备就绪,连接到抖音打印控件成功");
            PrintCenter.hasOpen = true;
            self.hasOpen = true;
            setTimeout(function () {
                self.doGetPrinters();
                self.getAgentInfo();
            }, 1000);
            self.randomP = parseInt(10000000 * Math.random());
        };
        // 监听消息
        self.socket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            if ("getPrinters" == data.cmd) {
                //alert('打印机列表:' + JSON.stringify(data.printers));
                var printers = data.printers;
                if (printers.length > 0) {
                    var hasEmpty = false;
                    for (var i = 0; i < self.printerList.length; i++) {
                        var obj = self.printerList[i];
                        if (obj.key == "") hasEmpty = true;
                    }
                    if (!hasEmpty) {
                        self.printerList.push({
                            key: "",
                            value: ""
                        });
                    }
                    for (var i = printers.length; i > 0;) {
                        var printerName = printers[--i].name;
                        var hasPrinter = false;
                        for (var j = 0; j < self.printerList.length; j++) {
                            var obj = self.printerList[j];
                            if (obj.key == printerName) hasPrinter = true;
                        }
                        if (!hasPrinter) {
                            self.printerList.push({
                                key: printerName,
                                value: printerName
                            });
                        }
                    }
                } else {
                    self.alertBox(" ", "系统没有可用的打印机，请检查操作系统的设备与打印机");
                }
                self.defaultPrinter = data.defaultPrinter;
            } else if ("print" == data.cmd && self.isPreview) {
                if (data.status == "failed") {
                    self.alertBox(" ", JSON.stringify(data));
                    // clearTimeout(CainiaoPrint.timeOutId);
                } else {
                    if (self.previewType == "image") {
                        self.view.get("#previewPanel").show();
                        var images = data.previewImage;
                        for (var i = 0; i < images.length; i++) {
                            var url = images[i];
                            $("#picContainer").append("<img src='" + url + "' width='378px' height='684px'/></br>");
                        }
                    } else {
                        window.open(data.previewURL, "预览");
                    }
                }
                if (self.view) self.view.get("#tip_loading_prt").hide();
            } else if ("print" == data.cmd && !self.isPreview) {
                // if(PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3){
                //     if (PrintCenter.updateStatusMode == 3 && data.status == "failed") {
                //         self.alertBox(" ", JSON.stringify(data));
                //     }
                //     PrintCenter.refreshStatus(data);
                // }else{
                if (data.status != "success") {
                    self.alertBox(" ", data.msg ? data.msg : data.status);
                    // clearTimeout(self.timeOutId);
                    // clearTimeout(self.isCloseId);
                }
                // }
            } else if ("notifyPrintResult" == data.cmd) {
                if (self.isPreview) {
                    if (data.status == "failed") {
                        self.alertBox(" ", JSON.stringify(data));
                        // clearTimeout(CainiaoPrint.timeOutId);
                    }
                    if (self.view) self.view.get("#tip_loading_prt").hide();
                    return;
                }
                var printStatus = data.printStatus;
                if (data.taskStatus == "printed" && self.renderCallBack) {
                    self.renderCallBack(data, self.printingMapDy);
                }
                var msg = "以下单据打印失败：\n";
                var isFailed = false;
                for (var i = 0; i < printStatus.length; i++) {
                    var printStatu = printStatus[i];
                    var documentID = printStatus[i].documentID;
                    var obj = self.printingObjDy;
                    if (printStatu.status != "success") {
                        var billNO = obj[documentID].billNo;
                        var expressUid = obj[documentID].expressUid;
                        isFailed = true;
                        if (expressUid != null && expressUid != '')
                            msg += "快递单" + expressUid + ":" + printStatu.msg + ";" + "\n";
                        else
                            msg += "单据" + billNO + ":" + printStatu.msg + ";" + "\n";
                    }
                }
                // if(PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3){
                //     if(isFailed) self.alertBox(" ", msg);
                //     PrintCenter.refreshStatus(data);
                // } else
                if (isFailed) {
                    self.alertBox(" ", msg);
                    if (self.renderCallBack && data.taskID) {
                        self.renderCallBack(data, self.printingMapDy);
                        self.randomP = parseInt(10000000 * Math.random());
                    }
                }
                PrintCenter.refreshSeriesPrintingTasks(data);
            } else if ("getAgentInfo" == data.cmd) {
                self.CaiNiaoVersion = data.version;
            } else if ("getTaskStatus" == data.cmd) {
                PrintCenter.getTaskStatusHandler(data);
            } else {
                if (data.status != "success") {
                    if (self.view) self.view.get("#tip_loading_prt").hide();
                    self.alertBox(" ", data.msg);
                    // clearTimeout(CainiaoPrint.timeOutId);
                }

            }
        };

        // 监听Socket的关闭
        self.socket.onclose = function (event) {
            self.hasOpen = false;
            if (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) {
                PrintCenter.onClose();
            }
            console.log("抖音打印控件已经被关闭！");
            if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
            // self.alertBox(" ","菜鸟打印控件已经被关闭！");
        }

        self.socket.onerror = function (event) {
            self.hasOpen = false;
            if (self.operMode == operModeList.preview || self.operMode == operModeList.print) {
                var data = JSON.parse(event.data);
                console.log("抖音打印控件发生错误:" + JSON.stringify(data));
                alert("抖音打印控件发生错误:" + JSON.stringify(data))
            }
        }
    }

    /***
     * 获取打印机列表
     */
    this.doGetPrinters = function () {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: "getPrinters"
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 返回打印机列表
     * @returns  array[{key:printerName, value:printerName}]
     */
    this.getPrinterList = function () {
        return self.printerList;
    }


    /***
     * 配置打印机协议
     */
    this.doPrinterConfig = function () {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: 'printerConfig'
        };
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 打印机配置
     */
    this.doSetPrinterConfig = function (printerName, offsetLeft, offsetTop, needUpLogo, needDownLogo, paperWidth, paperHeight, printLimit) {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: 'setPrinterConfig',
            printer: {
                name: printerName != null && printerName != "" ? printerName : self.defaultPrinter
            }
        };
        if (offsetLeft != null) {
            request.printer.horizontalOffset = offsetLeft;
        }
        if (offsetTop != null) {
            request.printer.verticalOffset = offsetTop;
        }
        if (needUpLogo != null) {
            request.printer.needTopLogo = needUpLogo;
        }
        if (needDownLogo != null) {
            request.printer.needBottomLogo = needDownLogo;
        }
        if (paperWidth != null && paperHeight != null) {
            request.printer.paperSize = {"width": Math.ceil(paperWidth), "height": Math.ceil(paperHeight)};
        }
        if (printLimit != null) {//强制无空边
            request.printer.forceNoPageMargins = printLimit;
        }
        request.printer.autoOrientation = true;
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 根据taskID查询打印任务
     */
    this.doGetTaskStatus = function (requestID, taskArr) {
        var random = parseInt(100000000 * Math.random()) + "";
        var request = {
            requestID: requestID != null && requestID != '' ? requestID : random,
            version: self.version,
            cmd: "getTaskStatus",
            taskID: taskArr
        };
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 根据面单号查询打印任务
     */
    this.doGetDocumentStatus = function (requestID, waybillNO) {
        var request = {
            requestID: requestID,
            version: self.version,
            cmd: "getDocumentStatus",
            documentIDs: [
                waybillNO
            ]
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 获取菜鸟控件版本号
     */
    this.getAgentInfo = function () {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: "getAgentInfo"
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 菜鸟控件是否需要升级
     */
    this.needUpdate = function () {
        var ver = self.CaiNiaoVersion;
        if (ver != null) {
            var nums = ver.split(".");
            var lasts = self.lastVersion.split(".");
            return self.needUp(nums, lasts, 0);
        }
        return true;
    }

    this.needUp = function (nums, lasts, i) {
        if (Number(nums[i]) > Number(lasts[i])) {
            return false;
        } else if (Number(nums[i]) < Number(lasts[i])) {
            return true;
        } else {
            if (i < nums.length - 1) {
                return self.needUp(nums, lasts, ++i);
            } else {
                return false;
            }
        }
    }

    this.doPrint = function (datas, reSend) {
        if (!self.hasConnected()) {
            self.alertBox();
            return;
        }
        // if(!reSend){
        //   self.printingObjJD = new Object();
        //   PrintCenter.printingMap = new Object();
        //   PrintCenter.taskObject = new Object();
        // }
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var documents = data.task.documents;
            data.task.taskStatus = "sending";
            // if(!self.isPreview && (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3)){
            //     PrintCenter.taskObject[data.task.taskID] = data.task;
            // }

            var arr = new Array();
            var billIDs = "";
            var billNos = "";
            for (var j = 0; j < documents.length; j++) {
                var obj = new Object();
                obj.billNo = documents[j].billNo;
                obj.billID = documents[j].documentID;
                arr.push(obj);
                self.printingObjDy[documents[j].documentID] = obj;

                if (billIDs != "") billIDs += ",";
                billIDs += documents[j].documentID;
                if (billNos != "") billNos += ",";
                billNos += documents[j].billNo;
            }

            if (!self.isPreview) {
                self.printingMapDy[data.task.taskID] = arr;
            }
            self.socket.send(JSON.stringify(data));
            if (PrintCenter.updateStatusMode == 2 && !self.isPreview && PrintCenter.callback) {
                PrintCenter.callback(billIDs, billNos, "", 1, i == datas.length - 1);
            }
        }
        // if((PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) && !self.isPreview && !reSend) {
        //     PrintCenter.showProcess(PrintCenter.printingMap);
        // }
    }

    this.alertBox = function (title, message) {
        var i = 0;
        if (!message) {
            message = "您是否已经安装打印组件？</br>";
            var href = "javascript:window.open('" + self.downloadUrl + "')";
            var target = "";
            if (myBrowser() == "FF") {
                href = self.downloadUrl;
                target = "target=\"_blank\"";
            }
            message += "<ul style='list-style-type:disc;margin-left:20px;line-height:25px;margin-top:5px;'><li style='list-style-type:disc;'>若还未安装，请<a " + target + " href=\"" + href + "\">点此下载安装</a>。安装完成后需要刷新页面才能使用。</li>";
            message += "<li style='list-style-type:disc;'>已经安装的，请先确认组件已经打开并正常运行：</li></ul>";
            message += "<div style='margin-left:25px;'>" + ++i + ".重启组件后再次尝试</br>"
            if (myBrowser() == "FF" || myBrowser().startsWith("IE")) {
                var isIE = false;
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    isIE = true;
                }
                if (isIE) {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/ie.gif' style='width:20px;height:20px;'/>&nbsp;IE11<a href='" + self.ie11Wike + "' target='_blank'>(点此查看教程)</a> </br>";
                } else {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/firefox.gif' style='width:20px;height:20px;'/>&nbsp;Firefox<a href='" + self.firefoxWiki + "' target='_blank'>(点此查看教程)</a> </br>";
                }
            }
            message += "<div style='padding-top:5px;'>" + ++i + ".若以上方法均无效，请点击右上角联系客服" + "</div>";
            message += "</div>";
        }

        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        $("body").remove("#printAlertCN").append("<div id='printAlertCN' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
            "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
            "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
            "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:120px;" +
            "width:500px;height:240px;z-index:999999;background-color:#fff;'>" +
            "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
            "&nbsp;&nbsp;提示</div>" +
            "<a style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:block;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='CainiaoPrint.hideAlertBox()'></a>" +
            "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
            "<div style='width: 90%; line-height: 20px; padding-left: 20px; font-size: 13px; margin-top: 5px;'>" +
            "<div style='font-size:14px;font-weight:bold;'>" + (title ? title : "抱歉，抖音打印控件连接失败了<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/49.gif'/>") + "</div>" +
            "<div style='padding-top:8px'>" + message +
            "</div></div>" +
            //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
            "</div></div>");
        if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
    }

    this.hideAlertBox = function () {
        $("#printAlertCN").remove();
    }

    this.printTimeOut = function () {
        if (self.view && self.view.get("#tip_loading_prt").get("visible") == true) {
            var obj = PrintCenter.printingMap;
            var uids = "";
            var salercptUids = "";
            var printSalercptUid = "";
            var taskArr = new Array();
            for (var taskID in obj) {
                taskArr.push(taskID + "");
            }
            self.doGetTaskStatus(taskArr);
            for (var taskID in obj) {
                var arr = obj[taskID];
                for (var j = 0; j < arr.length; j++) {
                    var o = arr[j];
                    var expressUid = o.expressUid;
                    var salercptUid = o.salercptUid;
                    if (printSalercptUid != "") printSalercptUid += ",";
                    printSalercptUid += salercptUid;
                    uids += expressUid;
                    if (j % 5 == 0) {
                        uids += ",\n";
                    } else {
                        uids += ",";
                    }
                }
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
            if (uids != null && uids != "")
                self.alertBox(" ", "打印超时，以下快递单没有打上打印标识，请检查打印标识和实际打印出纸是否一一对应：\n" + uids);
            if (self.renderTimeOutCallBack && data.taskID.indexOf("express_") > -1) {
                self.renderTimeOutCallBack(printSalercptUid);
            }

        }
        // clearTimeout(self.isCloseId);
    }

    this.isClosed = function (preview) {
        if (!self.socket || self.socket.readyState != 1) {
            var obj = PrintCenter.printingMap;
            var uids = "";
            for (var key in obj) {
                var arr = obj[key];
                for (var j = 0; j < arr.length; j++) {
                    var o = arr[j];
                    if (!o[key]) continue;
                    var expressUid = o[key].expressUid;
                    uids += expressUid;
                    if (i % 5 == 0) {
                        uids += ",\n";
                    } else {
                        uids += ",";
                    }
                }
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
            var msg = "打印控件链接失败";
            if (uids != null && uids != "") {
                msg += "以下快递单没有打上打印标识，请检查打印标识和实际打印出纸是否一一对应：\n" + uids;
            }
            self.alertBox(" ", msg);
            // clearTimeout(self.timeOutId);
        } else {
            self.isCloseId = setTimeout(function () {
                self.isClosed(preview);
            }, 5000);
        }
    }

}


/**
 * 劳道普云打印调用
 */
var LodopPrint = new function () {

    var self = this;
    this.jobs = [];
    this.printerList = [];
    this.downloadUrl = "http://demo.c-lodop.com:8000/Lodop6.226_Clodop4.127.zip";

    //==判断是否需要CLodop(那些不支持插件的浏览器):==
    this.needCLodop = function () {
        try {
            var ua = navigator.userAgent;
            if (ua.match(/Windows\sPhone/i))
                return true;
            if (ua.match(/iPhone|iPod|iPad/i))
                return true;
            if (ua.match(/Android/i))
                return true;
            if (ua.match(/Edge\D?\d+/i))
                return true;

            var verTrident = ua.match(/Trident\D?\d+/i);
            var verIE = ua.match(/MSIE\D?\d+/i);
            var verOPR = ua.match(/OPR\D?\d+/i);
            var verFF = ua.match(/Firefox\D?\d+/i);
            var x64 = ua.match(/x64/i);
            if ((!verTrident) && (!verIE) && (x64))
                return true;
            else if (verFF) {
                verFF = verFF[0].match(/\d+/);
                if ((verFF[0] >= 41) || (x64))
                    return true;
            } else if (verOPR) {
                verOPR = verOPR[0].match(/\d+/);
                if (verOPR[0] >= 32)
                    return true;
            } else if ((!verTrident) && (!verIE)) {
                var verChrome = ua.match(/Chrome\D?\d+/i);
                if (verChrome) {
                    verChrome = verChrome[0].match(/\d+/);
                    if (verChrome[0] >= 41)
                        return true;
                }
            }
            return false;
        } catch (err) {
            return true;
        }
    }

    //==加载引用CLodop的主JS,用双端口8000和18000(以防其中一个被占):==
    this.init = function (view) {
        this.view = view;
        if (this.CLodopJsState == "loading" || this.CLodopJsState == "complete") return;
        this.CLodopJsState = "loading";
        var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        var JS1 = document.createElement("script");
        var JS2 = document.createElement("script");
        JS1.async="async";
        JS2.async="async";
        JS1.defer="defer";
        JS2.defer="defer";
        JS1.src = "http://localhost:8000/CLodopfuncs.js?priority=1";
        JS2.src = "http://localhost:18000/CLodopfuncs.js";
        JS1.onload = JS2.onload = function () {
            self.CLodopJsState = "complete";
        }
        JS1.onerror = JS2.onerror = function (evt) {
            self.CLodopJsState = "complete";
        }
        head.insertBefore(JS1, head.firstChild);
        head.insertBefore(JS2, head.firstChild);
        setTimeout(function () {
            self.CLodopJsState = "complete";
        }, 500);
        this.CLodopIsLocal = !!((JS1.src + JS2.src).match(/\/\/localho|\/\/127.0.0./i));
    }

    this.alertBox = function (title, message) {
        var i = 0;
        // if (!message) {
        message = "您是否已经安装打印组件？</br>";
        var href = "javascript:window.open('" + self.downloadUrl + "')";
        var target = "";
        if (myBrowser() == "FF") {
            href = self.downloadUrl;
            target = "target=\"_blank\"";
        }
        message += "<ul style='list-style-type:disc;margin-left:20px;line-height:25px;margin-top:5px;'><li style='list-style-type:disc;'>若还未安装，请<a " + target + " href=\"" + href + "\">点此下载安装</a>。安装完成后需要刷新页面才能使用。</li>";
        message += "<li style='list-style-type:disc;'>已经安装的，请先确认组件已经打开并正常运行：</li></ul>";
        message += "<div style='margin-left:25px;'>" + ++i + ".重启组件后再次尝试</br>"
        if (myBrowser() == "FF" || myBrowser().startsWith("IE")) {
            var isIE = false;
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                isIE = true;
            }
            if (isIE) {
                message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/ie.gif' style='width:20px;height:20px;'/>&nbsp;IE11<a href='" + self.ie11Wike + "' target='_blank'>(点此查看教程)</a> </br>";
            } else {
                message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/firefox.gif' style='width:20px;height:20px;'/>&nbsp;Firefox<a href='" + self.firefoxWiki + "' target='_blank'>(点此查看教程)</a> </br>";
            }
        }
        message += "<div style='padding-top:5px;'>" + ++i + ".若以上方法均无效，请点击右上角联系客服" + "</div>";
        message += "</div>";
        // }

        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        $("body").remove("#printAlertCN").append("<div id='printAlertCN' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
            "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
            "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
            "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:120px;" +
            "width:500px;height:240px;z-index:999999;background-color:#fff;'>" +
            "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
            "&nbsp;&nbsp;提示</div>" +
            "<a style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:block;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='CainiaoPrint.hideAlertBox()'></a>" +
            "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
            "<div style='width: 90%; line-height: 20px; padding-left: 20px; font-size: 13px; margin-top: 5px;'>" +
            "<div style='font-size:14px;font-weight:bold;'>" + (title ? title : "抱歉，LODOP 打印组件连接失败了<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/49.gif'/>") + "</div>" +
            "<div style='padding-top:8px'>" + message +
            "</div></div>" +
            //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
            "</div></div>");
        if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
    }

    this.hideAlertBox = function () {
        $("#printAlertPdd").remove();
    }

    //==获取LODOP对象主过程,判断是否安装、需否升级:==
    this.getLodop = function (oOBJECT, oEMBED) {
        var strHtmInstall = "打印控件未安装!点击这里<a href='http://demo.c-lodop.com:8000/Lodop6.226_Clodop4.127.zip' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。";
        var strHtmUpdate = "打印控件需要升级!点击这里<a href='http://www.lodop.net/download.html' target='_self'>执行升级</a>,升级后请重新进入。";
        var strHtm64_Install = "打印控件未安装!点击这里<a href='http://www.lodop.net/download/CLodop_Setup_for_Win64NT_4.127EN.zip' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。";
        var strHtm64_Update = "打印控件需要升级!点击这里<a href='http://www.lodop.net/download.html' target='_self'>执行升级</a>,升级后请重新进入。";
        var strHtmFireFox = "<br>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）";
        var strHtmChrome = "<br>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）";
        var strCLodopInstall_1 = "Web打印服务CLodop未安装启动，点击这里<a href='http://demo.c-lodop.com:8000/Lodop6.226_Clodop4.127.zip' target='_self'>下载执行安装</a>";
        var strCLodopInstall_2 = "<br>（若此前已安装过，可<a href='CLodop.protocol:setup' target='_self'>点这里直接再次启动</a>）";
        var strCLodopInstall_3 = "，成功后请刷新本页面。";
        var strCLodopUpdate = "Web打印服务CLodop需升级!点击这里<a href='http://www.lodop.net/download.html' target='_self'>执行升级</a>,升级后请刷新页面。";
        var LODOP;
        try {
            var ua = navigator.userAgent;
            var isIE = !!(ua.match(/MSIE/i)) || !!(ua.match(/Trident/i));
            if (self.needCLodop()) {
                try {
                    self.init(this.view);
                    LODOP = getCLodop();
                } catch (err) {
                }
                if (!LODOP && this.CLodopJsState !== "complete") {
                    if (this.CLodopJsState == "loading") alert("网页还没下载完毕，请稍等一下再操作."); else alert("没有加载CLodop的主js，请先调用loadCLodop过程.");
                    return;
                }
                if (!LODOP) {
                    var message = strCLodopInstall_1 + (this.CLodopIsLocal ? strCLodopInstall_2 : "") + strCLodopInstall_3;
                    this.alertBox(null, message);
                    return;
                } else {
                    if (CLODOP.CVERSION < "4.1.2.7") {
                        var message = strCLodopUpdate;
                        this.alertBox(null, message);
                    }
                    if (oEMBED && oEMBED.parentNode)
                        oEMBED.parentNode.removeChild(oEMBED); //清理旧版无效元素
                    if (oOBJECT && oOBJECT.parentNode)
                        oOBJECT.parentNode.removeChild(oOBJECT);
                }
            } else {
                var is64IE = isIE && !!(ua.match(/x64/i));
                //==如果页面有Lodop就直接使用,否则新建:==
                if (oOBJECT || oEMBED) {
                    if (isIE)
                        LODOP = oOBJECT;
                    else
                        LODOP = oEMBED;
                } else if (!this.CreatedOKLodopObject) {
                    LODOP = document.createElement("object");
                    LODOP.setAttribute("width", 0);
                    LODOP.setAttribute("height", 0);
                    LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                    if (isIE)
                        LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                    else
                        LODOP.setAttribute("type", "application/x-print-lodop");
                    document.documentElement.appendChild(LODOP);
                    this.CreatedOKLodopObject = LODOP;
                } else
                    LODOP = this.CreatedOKLodopObject;
                //==Lodop插件未安装时提示下载地址:==
                if ((!LODOP) || (!LODOP.VERSION)) {
                    var message;
                    if (ua.indexOf('Chrome') >= 0) message = strHtmChrome;
                    if (ua.indexOf('Firefox') >= 0) message = strHtmFireFox;
                    this.alertBox(null, message);
                    return LODOP;
                }
            }
            if (LODOP.VERSION < "6.2.2.6") {
                if (!self.needCLodop()) {
                    var message = (is64IE ? strHtm64_Update : strHtmUpdate);
                    this.alertBox(null, message);
                }
            }
            //===如下空白位置适合调用统一功能(如注册语句、语言选择等):==
            LODOP.SET_LICENSES("", "AE47368968F063B455707A8E9673962527F", "23580B189D96F33252722697A57AC00506B", "");
            //=======================================================
            return LODOP;
        } catch (err) {
            alert("getLodop出错:" + err);
        }
    }

    this.getPrinterList = function () {
        return self.printerList;
    }

    this.doPrint = function (lodopArr, callbackParams) {
        var LODOP = this.getLodop();
        if (LODOP) {
            var self = this;
            var billIDs = "";
            var billNos = "";
            LODOP.PRINT_INIT("Lodop功能_按网址打印");
            LODOP.SET_PRINT_MODE("POS_BASEON_PAPER", true);
            LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS", true);

            for (var i = 0; i < lodopArr.length; i++) {
                var documents = lodopArr[i].task.documents;
                var taskNo = lodopArr[i].task.taskID;

                LODOP.SET_PRINTER_INDEX(lodopArr[i].task.printer);

                for (var j = 0; j < documents.length; j++) {
                    var item = new Object();
                    item.billID = documents[j].documentID;
                    if (billIDs != "") billIDs += ",";
                    billIDs += item.billID;
                    item.billNo = documents[j].billNo;
                    if (billNos != "") billNos += ",";
                    billNos += item.billNo;
                    PrintCenter.printingObj[documents[j].documentID] = item;
                    for (var n = 0; n < documents[j].contents.length; n++) {
                        var content = documents[j].contents[n];
                        if (self.isPdf(content)) {
                            LODOP.ADD_PRINT_PDF(0, 0, "100%", "100%", self.downloadPDF(content));
                        } else {
                            LODOP.ADD_PRINT_HTM(0, 0, "100%", "100%", "URL:" + content);
                        }
                        if (documents[j].contents.length > 1 && n < documents[j].contents.length - 1) {
                            LODOP.NewPageA();
                        }
                    }
                    if (documents.length > 1 && j < documents.length - 1) {
                        LODOP.NewPageA();
                    }
                }

                if (LODOP.CVERSION) {
                    LODOP.On_Return = function (taskID, jobCode) {
                        if (jobCode) {
                            PrintCenter.callback(billIDs, billNos, "", 1, true);
                            var json = new Object();
                            json.taskID = taskNo;
                            PrintCenter.refreshSeriesPrintingTasks(json);
                        } else {
                            // PrintCenter.callback(billIDs, billNos, "", 0, true);
                            if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
                        }
                    }
                    if (self.isPreview == true) LODOP.PREVIEW();
                    else LODOP.PRINT();
                } else {
                    var jobCode;
                    if (self.isPreview == true) jobCode = LODOP.PREVIEW();
                    else jobCode = LODOP.PRINT();
                    if (jobCode) PrintCenter.callback(billIDs, billNos, "", 1, true);
                    else {
                        // PrintCenter.callback(billIDs, billNos, "", 0, true);
                        if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
                    }
                }
            }

        }
    }

    this.isPdf = function (url) {
        if (!url) {
            return false;
        }
        return new RegExp("\.pdf\s*$", "i").test(url);
    }

    this.downloadPDF = function (url) {
        if (!(/^https?:/i.test(url))) return;
        if (window.XMLHttpRequest) var xhr = new XMLHttpRequest(); else var xhr = new ActiveXObject("MSXML2.XMLHTTP");
        xhr.open('GET', url, false); //同步方式
        if (xhr.overrideMimeType)
            try {
                xhr.responseType = 'arraybuffer';
                var arrybuffer = true;
            } catch (err) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
        xhr.send(null);
        var data = xhr.response || xhr.responseBody;
        if (typeof Uint8Array !== 'undefined') {
            if (arrybuffer) var dataArray = new Uint8Array(data); else {
                var dataArray = new Uint8Array(data.length);
                for (var i = 0; i < dataArray.length; i++) {
                    dataArray[i] = data.charCodeAt(i);
                }
            }
        } else
            var dataArray = VBS_BinaryToArray(data).toArray(); //兼容IE低版本
        return self.getBASE64(dataArray);
    }

    this.getBASE64 = function (dataArray) {
        var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var strData = "";
        for (var i = 0, ii = dataArray.length; i < ii; i += 3) {
            if (isNaN(dataArray[i])) break;
            var b1 = dataArray[i] & 0xFF, b2 = dataArray[i + 1] & 0xFF, b3 = dataArray[i + 2] & 0xFF;
            var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
            var d3 = i + 1 < ii ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
            var d4 = i + 2 < ii ? (b3 & 0x3F) : 64;
            strData += digits.substring(d1, d1 + 1) + digits.substring(d2, d2 + 1) + digits.substring(d3, d3 + 1) + digits.substring(d4, d4 + 1);
        }
        return strData;
    }

}

/**
 * 美团打印控件调用
 * author harry
 */
var MeituanPrint = new function () {
    var self = this;
    this.version = "1.0";
    this.MeituanVersion = null;
    this.lastVersion = "2.0.8";
    this.printer_address = "localhost:28613";
    this.socket = null;
    this.defaultPrinter;
    this.operMode;
    this.hasOpen = false;
    this.isPreview = false;
    this.view;
    this.previewType = "pdf";// pdf/image如果是预览模式，是以pdf还是image方式预览，二选一，此属性不是必选，默认以pdf预览。
    this.printerList = new Array();//打印机列表
    this.PX_TO_PT = 0.75;//px转换为pt
    this.PT_TO_MM = 25.4 / 72;//pt转换为mm
    this.renderCallBack;
    this.renderTimeOutCallBack;
    this.timeOutId = null;
    this.isCloseId = null;
    this.randomP = null;
    this.time1;
    this.downloadUrl = "http://portal-portm.meituan.com/klfe/mtob/prod/downloadConfig?version=2.0.8";
    this.ie11Wike = "http://wiki.hupun.com/pages/viewpage.action?pageId=10158477";
    this.firefoxWiki = "http://wiki.hupun.com/pages/viewpage.action?pageId=10158570";

    /**
     * 初始化打印控件
     */
    this.init = function (view) {
        if (myBrowser() == "IE" || myBrowser() == "IE7" || myBrowser() == "IE8" || myBrowser() == "IE9" || myBrowser() == "IE10") {
            return;
        }
        self.view = view;
        self.doConnect();
    }

    this.hasConnected = function () {
        if (self.socket && self.socket.readyState == 1) {
            return true;
        } else {
            self.doConnect();
        }
        return false;
    }

    this.getMeituanSignKey = function () {
        var dtd = $.Deferred();
        try {
            App.transformUrl("$print-web").done(function (printWebAddress) {
                $.get(printWebAddress + "/print/signature/getMeituanSignKey").done(function (result) {
                    var app_id = result.app_id;
                    var poi_id = result.poi_id;
                    var timestamp = result.timestamp;
                    var sig = result.sig;
                    var pluginKey = result.pluginKey;
                    var sig = "/websocket?pluginKey=" + pluginKey + "&timestamp=" + timestamp + "&sig=" + sig + "&app_id=" + app_id + "&poi_id=" + poi_id;
                    dtd.resolve(sig);
                }).fail(function (e) {
                    dtd.reject(e);
                });
            }).fail(function (e) {
                dtd.reject(e);
            });
        } catch (e) {
        }

        return dtd;
    }

    this.closeSocket = function () {
        self.socket.close();
    }

    /**
     * 连接打印机
     */
    this.doConnect = function () {
        self.getMeituanSignKey().done(function (sig) {
            self._doConnect(sig);
        }).fail(function (e) {
            console.log("获取美团控件链接参数失败");
            console.log(e);
        });
    }

    /**
     * 内部方法，连接打印机
     */
    this._doConnect = function (sig) {
        if (self.socket && self.socket.readyState == 1) {
            return;
        }
        self.socket = new WebSocket('wss://' + self.printer_address + sig);
        // 打开Socket
        self.socket.onopen = function (event) {
            console.log("Websocket准备就绪,连接到美团控件成功");
            PrintCenter.hasOpen = true;
            self.hasOpen = true;
            setTimeout(function () {
                self.doGetPrinters();
                self.getAgentInfo();
            }, 1000);
            self.randomP = parseInt(10000000 * Math.random());
        };
        // 监听消息
        self.socket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            if ("getPrinters" == data.cmd) {
                //alert('打印机列表:' + JSON.stringify(data.printers));
                var printers = data.printers;
                if (printers.length > 0) {
                    var hasEmpty = false;
                    for (var i = 0; i < self.printerList.length; i++) {
                        var obj = self.printerList[i];
                        if (obj.key == "") hasEmpty = true;
                    }
                    if (!hasEmpty) {
                        self.printerList.push({
                            key: "",
                            value: ""
                        });
                    }
                    for (var i = printers.length; i > 0;) {
                        var printerName = printers[--i].name;
                        var hasPrinter = false;
                        for (var j = 0; j < self.printerList.length; j++) {
                            var obj = self.printerList[j];
                            if (obj.key == printerName) hasPrinter = true;
                        }
                        if (!hasPrinter) {
                            self.printerList.push({
                                key: printerName,
                                value: printerName
                            });
                        }
                    }
                } else {
                    self.alertBox(" ", "系统没有可用的打印机，请检查操作系统的设备与打印机");
                }
                self.defaultPrinter = data.defaultPrinter;
            } else if ("print" == data.cmd && self.isPreview) {
                if (data.status == "failed") {
                    self.alertBox(" ", JSON.stringify(data));
                    // clearTimeout(CainiaoPrint.timeOutId);
                } else {
                    if (self.previewType == "image") {
                        self.view.get("#previewPanel").show();
                        var images = data.previewImage;
                        for (var i = 0; i < images.length; i++) {
                            var url = images[i];
                            $("#picContainer").append("<img src='" + url + "' width='378px' height='684px'/></br>");
                        }
                    } else {
                        window.open(data.previewURL, "预览");
                    }
                }
                if (self.view) self.view.get("#tip_loading_prt").hide();
            } else if ("print" == data.cmd && !self.isPreview) {
                if (data.status == "success" && self.renderCallBack && data.taskID) {//&& data.taskID.indexOf("express_")>-1
                    self.renderCallBack(data, PrintCenter.printingMap);
                } else if (data.status != "success" && self.renderCallBack && data.taskID) {//&& data.taskID.indexOf("express_")>-1
                    self.renderCallBack(data, PrintCenter.printingMap);
                    self.randomP = parseInt(10000000 * Math.random());
//	        		if(self.view) self.view.get("#tip_loading_prt").hide();
                    self.alertBox(" ", JSON.stringify(data));
                } else if (data.status != "success") {
                    self.alertBox(" ", data.msg);
                }
            } else if ("notifyPrintResult" == data.cmd) {
                var printStatus = data.printStatus;
                // if(data.taskStatus == "printed" && self.renderCallBack){
                // 	self.renderCallBack(printStatus,PrintCenter.printingMap);
                // }
                var msg = "以下单据打印失败：\n";
                var isFailed = false;
                for (var i = 0; i < printStatus.length; i++) {
                    var printStatu = printStatus[i];
                    var documentID = printStatus[i].documentID;
                    var obj = PrintCenter.printingObj;
                    if (printStatu.status != "SUCCESS" && printStatu.status != "RENDERED") {
                        var billNO = obj[documentID].billNo;
                        var expressUid = obj[documentID].expressUid;
                        isFailed = true;
                        if (expressUid != null && expressUid != '')
                            msg += "快递单" + expressUid + ":" + printStatu.msg + ";" + "\n";
                        else
                            msg += "单据" + billNO + ":" + printStatu.msg + ";" + "\n";
                    }
                }
                // if(PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3){
                //     if(isFailed) self.alertBox(" ", msg);
                //     PrintCenter.refreshStatus(data);
                // } else
                if (isFailed) {
                    self.alertBox(" ", msg);
                    if (self.renderCallBack && data.taskID) {
                        self.renderCallBack(data, PrintCenter.printingMap);
                        self.randomP = parseInt(10000000 * Math.random());
                    }
                }
                PrintCenter.refreshSeriesPrintingTasks(data);
            } else if ("getAgentInfo" == data.cmd) {
                self.MeituanVersion = data.version;
            } else if ("getTaskStatus" == data.cmd) {
                PrintCenter.getTaskStatusHandler(data);
            } else {
                if (data.status != "success") {
                    if (self.view) self.view.get("#tip_loading_prt").hide();
                    self.alertBox(" ", data.msg);
                    // clearTimeout(CainiaoPrint.timeOutId);
                }

            }
        };

        // 监听Socket的关闭
        self.socket.onclose = function (event) {
            self.hasOpen = false;
            if (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) {
                PrintCenter.onClose();
            }
            console.log("美团打印控件已经被关闭！");
            if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
        }

        self.socket.onerror = function (event) {
            self.hasOpen = false;
            if (self.operMode == operModeList.preview || self.operMode == operModeList.print) {
                var data = JSON.parse(event.data);
                console.log("美团打印控件发生错误:" + JSON.stringify(data));
                alert("美团打印控件发生错误:" + JSON.stringify(data))
            }
        }
    }

    /***
     * 获取打印机列表
     */
    this.doGetPrinters = function () {
        var random = parseInt(100000000 * Math.random()) + "";
        var request = {
            requestID: random,
            version: self.version,
            cmd: "getPrinters"
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 返回打印机列表
     * @returns  array[{key:printerName, value:printerName}]
     */
    this.getPrinterList = function () {
        return self.printerList;
    }


    /***
     * 配置打印机协议
     */
    this.doPrinterConfig = function () {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: 'printerConfig'
        };
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 打印机配置
     */
    this.doSetPrinterConfig = function (printerName, offsetLeft, offsetTop, landscape) {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: 'setPrinterConfig',
            printer: {
                name: printerName != null && printerName != "" ? printerName : self.defaultPrinter
            }
        };
        if (offsetLeft != null) {
            request.printer.offsetLeft = offsetLeft;
        }
        if (offsetTop != null) {
            request.printer.offsetTop = offsetTop;
        }
        if (landscape != null) {
            request.printer.landscape = landscape;
        }
        // if (needUpLogo != null) {
        //     request.printer.needTopLogo = needUpLogo;
        // }
        // if (needDownLogo != null) {
        //     request.printer.needBottomLogo = needDownLogo;
        // }
        // if (paperWidth != null && paperHeight != null) {
        //     request.printer.paperSize = {"width": Math.ceil(paperWidth), "height": Math.ceil(paperHeight)};
        // }
        // if (printLimit != null) {//强制无空边
        //     request.printer.forceNoPageMargins = printLimit;
        // }
        // request.printer.autoOrientation = true;
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 根据taskID查询打印任务
     */
    this.doGetTaskStatus = function (requestID, taskArr) {
        var random = parseInt(100000000 * Math.random()) + "";
        var request = {
            requestID: requestID != null && requestID != '' ? requestID : random,
            version: self.version,
            cmd: "getTaskStatus",
            taskID: taskArr
        };
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 根据面单号查询打印任务
     */
    this.doGetDocumentStatus = function (requestID, waybillNO) {
        var request = {
            requestID: requestID,
            version: self.version,
            cmd: "getDocumentStatus",
            documentIDs: [
                waybillNO
            ]
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 获取美团控件版本号
     */
    this.getAgentInfo = function () {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: "getAgentInfo"
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 美团控件是否需要升级
     */
    this.needUpdate = function () {
        var ver = self.MeituanVersion;
        if (ver != null) {
            var nums = ver.split(".");
            var lasts = self.lastVersion.split(".");
            return self.needUp(nums, lasts, 0);
        }
        return true;
    }

    this.needUp = function (nums, lasts, i) {
        if (Number(nums[i]) > Number(lasts[i])) {
            return false;
        } else if (Number(nums[i]) < Number(lasts[i])) {
            return true;
        } else {
            if (i < nums.length - 1) {
                return self.needUp(nums, lasts, ++i);
            } else {
                return false;
            }
        }
    }

    this.doPrint = function (datas, reSend) {
        if (!self.hasConnected()) {
            self.alertBox();
            return;
        }
        // if(!reSend){
        //   PrintCenter.printingObj = new Object();
        //   PrintCenter.printingMap = new Object();
        //   PrintCenter.taskObject = new Object();
        // }
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var documents = data.task.documents;
            data.task.taskStatus = "sending";
            if (!self.isPreview && (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3)) {
                PrintCenter.taskObject[data.task.taskID] = data.task;
            }

            var arr = new Array();
            var billIDs = "";
            var billNos = "";
            for (var j = 0; j < documents.length; j++) {
                var obj = new Object();
                obj.billNo = documents[j].billNo;
                obj.billID = documents[j].documentID;
                arr.push(obj);
                PrintCenter.printingObj[documents[j].documentID] = obj;

                if (billIDs != "") billIDs += ",";
                billIDs += documents[j].documentID;
                if (billNos != "") billNos += ",";
                billNos += documents[j].billNo;
            }

            if (!self.isPreview) {
                PrintCenter.printingMap[data.task.taskID] = arr;
            }
            self.socket.send(JSON.stringify(data));
            if (PrintCenter.updateStatusMode == 2 && !self.isPreview && PrintCenter.callback) {
                PrintCenter.callback(billIDs, billNos, "", 1, i == datas.length - 1);
            }
        }
        // if((PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) && !self.isPreview && !reSend) {
        //     PrintCenter.showProcess(PrintCenter.printingMap);
        // }
    }

    this.alertBox = function (title, message) {
        var i = 0;
        if (!message) {
            message = "您是否已经安装打印组件？</br>";
            var href = "javascript:window.open('" + self.downloadUrl + "')";
            var target = "";
            if (myBrowser() == "FF") {
                href = self.downloadUrl;
                target = "target=\"_blank\"";
            }
            message += "<ul style='list-style-type:disc;margin-left:20px;line-height:25px;margin-top:5px;'><li style='list-style-type:disc;'>若还未安装，请<a " + target + " href=\"" + href + "\">点此下载安装</a>。安装完成后需要刷新页面才能使用。</li>";
            message += "<li style='list-style-type:disc;'>已经安装的，请先确认组件已经打开并正常运行：</li></ul>";
            message += "<div style='margin-left:25px;'>" + ++i + ".重启组件后再次尝试</br>"
            if (myBrowser() == "FF" || myBrowser().startsWith("IE")) {
                var isIE = false;
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    isIE = true;
                }
                if (isIE) {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/ie.gif' style='width:20px;height:20px;'/>&nbsp;IE11<a href='" + self.ie11Wike + "' target='_blank'>(点此查看教程)</a> </br>";
                } else {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/firefox.gif' style='width:20px;height:20px;'/>&nbsp;Firefox<a href='" + self.firefoxWiki + "' target='_blank'>(点此查看教程)</a> </br>";
                }
            }
            message += "<div style='padding-top:5px;'>" + ++i + ".若以上方法均无效，请点击右上角联系客服" + "</div>";
            message += "</div>";
        }

        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        $("body").remove("#printAlertCN").append("<div id='printAlertCN' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
            "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
            "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
            "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:120px;" +
            "width:500px;height:240px;z-index:999999;background-color:#fff;'>" +
            "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
            "&nbsp;&nbsp;提示</div>" +
            "<a style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:block;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='CainiaoPrint.hideAlertBox()'></a>" +
            "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
            "<div style='width: 90%; line-height: 20px; padding-left: 20px; font-size: 13px; margin-top: 5px;'>" +
            "<div style='font-size:14px;font-weight:bold;'>" + (title ? title : "抱歉，美团打印控件连接失败了<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/49.gif'/>") + "</div>" +
            "<div style='padding-top:8px'>" + message +
            "</div></div>" +
            //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
            "</div></div>");
        if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
    }

    this.hideAlertBox = function () {
        $("#printAlertCN").remove();
    }

    this.printTimeOut = function () {
        if (self.view && self.view.get("#tip_loading_prt").get("visible") == true) {
            var obj = PrintCenter.printingMap;
            var uids = "";
            var salercptUids = "";
            var printSalercptUid = "";
            var taskArr = new Array();
            for (var taskID in obj) {
                taskArr.push(taskID + "");
            }
            self.doGetTaskStatus(taskArr);
            for (var taskID in obj) {
                var arr = obj[taskID];
                for (var j = 0; j < arr.length; j++) {
                    var o = arr[j];
                    var expressUid = o.expressUid;
                    var salercptUid = o.salercptUid;
                    if (printSalercptUid != "") printSalercptUid += ",";
                    printSalercptUid += salercptUid;
                    uids += expressUid;
                    if (j % 5 == 0) {
                        uids += ",\n";
                    } else {
                        uids += ",";
                    }
                }
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
            if (uids != null && uids != "")
                self.alertBox(" ", "打印超时，以下快递单没有打上打印标识，请检查打印标识和实际打印出纸是否一一对应：\n" + uids);
            if (self.renderTimeOutCallBack && data.taskID.indexOf("express_") > -1) {
                self.renderTimeOutCallBack(printSalercptUid);
            }

        }
        // clearTimeout(self.isCloseId);
    }

    this.isClosed = function (preview) {
        if (!self.socket || self.socket.readyState != 1) {
            var obj = PrintCenter.printingMap;
            var uids = "";
            for (var key in obj) {
                var arr = obj[key];
                for (var j = 0; j < arr.length; j++) {
                    var o = arr[j];
                    if (!o[key]) continue;
                    var expressUid = o[key].expressUid;
                    uids += expressUid;
                    if (i % 5 == 0) {
                        uids += ",\n";
                    } else {
                        uids += ",";
                    }
                }
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
            var msg = "打印控件链接失败";
            if (uids != null && uids != "") {
                msg += "以下快递单没有打上打印标识，请检查打印标识和实际打印出纸是否一一对应：\n" + uids;
            }
            self.alertBox(" ", msg);
            // clearTimeout(self.timeOutId);
        } else {
            self.isCloseId = setTimeout(function () {
                self.isClosed(preview);
            }, 5000);
        }
    }

}


/**
 * 快手打印控件调用
 */
var KuaishouPrint = new function () {
    var self = this;
    this.version = "1.0";
    this.CaiNiaoVersion = null;
    this.lastVersion = "1.1.0";
    this.printer_address = "localhost:16888/ks/printer";
    this.socket = null;
    this.defaultPrinter;
    this.operMode;
    this.hasOpen = false;
    this.isPreview = false;
    this.view;
    this.previewType = "pdf";// pdf/image如果是预览模式，是以pdf还是image方式预览，二选一，此属性不是必选，默认以pdf预览。
    this.printerList = new Array();//打印机列表
    this.PX_TO_PT = 0.75;//px转换为pt
    this.PT_TO_MM = 25.4 / 72;//pt转换为mm
    this.renderCallBack;
    this.renderTimeOutCallBack;
    this.timeOutId = null;
    this.isCloseId = null;
    this.randomP = null;
    this.time1;
    this.downloadUrl = "https://s1-11586.kwimgs.com/kos/nlav11586/kuaishou-print-installer.exe";
    this.ie11Wike = "http://wiki.hupun.com/pages/viewpage.action?pageId=10158477";
    this.firefoxWiki = "http://wiki.hupun.com/pages/viewpage.action?pageId=10158570";
    this.printingMapDy = new Object();
    this.printingObjDy = new Object();

    /**
     * 初始化打印控件
     */
    this.init = function (view) {
        if (myBrowser() == "IE" || myBrowser() == "IE7" || myBrowser() == "IE8" || myBrowser() == "IE9" || myBrowser() == "IE10") {
            return;
        }
        self.view = view;
        self.doConnect();
    }

    this.hasConnected = function () {
        if (self.socket && self.socket.readyState == 1) {
            return true;
        } else {
            self.doConnect();
        }
        return false;
    }

    this.closeSocket = function () {
        self.socket.close();
    }

    /**
     * 连接打印机
     */
    this.doConnect = function () {
        if (self.socket && self.socket.readyState == 1) {
            return;
        }
        self.socket = new WebSocket('ws://' + self.printer_address);
        // 打开Socket
        self.socket.onopen = function (event) {
            console.log("Websocket准备就绪,连接到快手打印控件成功");
            PrintCenter.hasOpen = true;
            self.hasOpen = true;
            setTimeout(function () {
                self.doGetPrinters();
                //getAgentInfo未上线
                // self.getAgentInfo();
            }, 1000);
            self.randomP = parseInt(10000000 * Math.random());
        };
        // 监听消息
        self.socket.onmessage = function (event) {
            // console.log('kuaishou onmessage', event)
            var data = JSON.parse(event.data);
            if ("getPrinters" == data.cmd) {
                //alert('打印机列表:' + JSON.stringify(data.printers));
                var printers = data.printers;
                if (printers.length > 0) {
                    var hasEmpty = false;
                    for (var i = 0; i < self.printerList.length; i++) {
                        var obj = self.printerList[i];
                        if (obj.key == "") hasEmpty = true;
                    }
                    if (!hasEmpty) {
                        self.printerList.push({
                            key: "",
                            value: ""
                        });
                    }
                    for (var i = printers.length; i > 0;) {
                        var printerName = printers[--i].name;
                        var hasPrinter = false;
                        for (var j = 0; j < self.printerList.length; j++) {
                            var obj = self.printerList[j];
                            if (obj.key == printerName) hasPrinter = true;
                        }
                        if (!hasPrinter) {
                            self.printerList.push({
                                key: printerName,
                                value: printerName
                            });
                        }
                    }
                } else {
                    self.alertBox(" ", "系统没有可用的打印机，请检查操作系统的设备与打印机");
                }
                self.defaultPrinter = data.defaultPrinter;
            } else if ("print" == data.cmd && self.isPreview) {
                if (data.status == "failed") {
                    self.alertBox(" ", JSON.stringify(data));
                    // clearTimeout(CainiaoPrint.timeOutId);
                } else {
                    if (self.previewType == "image") {
                        self.view.get("#previewPanel").show();
                        var images = data.previewImage;
                        for (var i = 0; i < images.length; i++) {
                            var url = images[i];
                            $("#picContainer").append("<img src='" + url + "' width='378px' height='684px'/></br>");
                        }
                    } else {
                        window.open(data.previewURL, "预览");
                    }
                }
                if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
            } else if ("print" == data.cmd && !self.isPreview) {
                // if(PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3){
                //     if (PrintCenter.updateStatusMode == 3 && data.status == "failed") {
                //         self.alertBox(" ", JSON.stringify(data));
                //     }
                //     PrintCenter.refreshStatus(data);
                // }else{
                if (data.status != "success") {
                    self.alertBox(" ", data.msg ? data.msg : data.status);
                    // clearTimeout(self.timeOutId);
                    // clearTimeout(self.isCloseId);
                }
                // }
            } else if ("notifyPrintResult" == data.cmd) {
                if (self.isPreview) {
                    if (data.status == "failed") {
                        self.alertBox(" ", JSON.stringify(data));
                        // clearTimeout(CainiaoPrint.timeOutId);
                    }
                    if (self.view) self.view.get("#tip_loading_prt").hide();
                    return;
                }
                var printStatus = data.printStatus;
                if (data.taskStatus == "printed" && self.renderCallBack) {
                    self.renderCallBack(data, self.printingMapDy);
                }
                var msg = "以下单据打印失败：\n";
                var isFailed = false;
                for (var i = 0; i < printStatus.length; i++) {
                    var printStatu = printStatus[i];
                    var documentID = printStatus[i].documentID;
                    var obj = self.printingObjDy;
                    if (printStatu.status != "success") {
                        var billNO = obj[documentID].billNo;
                        var expressUid = obj[documentID].expressUid;
                        isFailed = true;
                        if (expressUid != null && expressUid != '')
                            msg += "快递单" + expressUid + ":" + printStatu.msg + ";" + "\n";
                        else
                            msg += "单据" + billNO + ":" + printStatu.msg + ";" + "\n";
                    }
                }
                // if(PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3){
                //     if(isFailed) self.alertBox(" ", msg);
                //     PrintCenter.refreshStatus(data);
                // } else
                if (isFailed) {
                    self.alertBox(" ", msg);
                    if (self.renderCallBack && data.taskID) {
                        self.renderCallBack(data, self.printingMapDy);
                        self.randomP = parseInt(10000000 * Math.random());
                    }
                }
                PrintCenter.refreshSeriesPrintingTasks(data);
            } else if ("getAgentInfo" == data.cmd) {
                self.CaiNiaoVersion = data.version;
            } else if ("getTaskStatus" == data.cmd) {
                PrintCenter.getTaskStatusHandler(data);
            } else {
                if (data.status != "success") {
                    if (self.view) self.view.get("#tip_loading_prt").hide();
                    self.alertBox(" ", data.msg);
                    // clearTimeout(CainiaoPrint.timeOutId);
                }

            }
        };

        // 监听Socket的关闭
        self.socket.onclose = function (event) {
            self.hasOpen = false;
            if (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) {
                PrintCenter.onClose();
            }
            console.log("快手打印控件已经被关闭！");
            if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
            // self.alertBox(" ","菜鸟打印控件已经被关闭！");
        }

        self.socket.onerror = function (event) {
            self.hasOpen = false;
            if (self.operMode == operModeList.preview || self.operMode == operModeList.print) {
                var data = JSON.parse(event.data);
                console.log("快手打印控件发生错误:" + JSON.stringify(data));
                alert("快手打印控件发生错误:" + JSON.stringify(data))
            }
        }
    }

    /***
     * 获取打印机列表
     */
    this.doGetPrinters = function () {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: "getPrinters"
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 返回打印机列表
     * @returns  array[{key:printerName, value:printerName}]
     */
    this.getPrinterList = function () {
        return self.printerList;
    }


    /***
     * 配置打印机协议
     */
    this.doPrinterConfig = function (printerName) {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: 'getPrinterConfig',
            printer: {
                name: printerName != null && printerName != "" ? printerName : self.defaultPrinter
            }
        };
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 打印机配置
     */
    this.doSetPrinterConfig = function (printerName, offsetLeft, offsetTop, needUpLogo, needDownLogo, paperWidth, paperHeight, printLimit) {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: 'setPrinterConfig',
            printer: {
                name: printerName != null && printerName != "" ? printerName : self.defaultPrinter
            }
        };
        if (offsetLeft != null) {
            request.printer.horizontalOffset = offsetLeft;
        }
        if (offsetTop != null) {
            request.printer.verticalOffset = offsetTop;
        }
        if (needUpLogo != null) {
            request.printer.needTopLogo = needUpLogo;
        }
        if (needDownLogo != null) {
            request.printer.needBottomLogo = needDownLogo;
        }
        if (paperWidth != null && paperHeight != null) {
            request.printer.paperSize = {"width": Math.ceil(paperWidth), "height": Math.ceil(paperHeight)};
        }
        if (printLimit != null) {//强制无空边
            request.printer.forceNoPageMargins = printLimit;
        }
        request.printer.autoOrientation = true;
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 根据taskID查询打印任务
     */
    this.doGetTaskStatus = function (requestID, taskArr) {
        var random = parseInt(100000000 * Math.random()) + "";
        var request = {
            requestID: requestID != null && requestID != '' ? requestID : random,
            version: self.version,
            cmd: "getTaskStatus",
            taskID: taskArr
        };
        self.socket.send(JSON.stringify(request));
    }

    /***
     * 根据面单号查询打印任务
     */
    this.doGetDocumentStatus = function (requestID, waybillNO) {
        var request = {
            requestID: requestID,
            version: self.version,
            cmd: "getDocumentStatus",
            documentIDs: [
                waybillNO
            ]
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 获取快手控件版本号
     */
    this.getAgentInfo = function () {
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: "getAgentInfo"
        };
        self.socket.send(JSON.stringify(request));
    }

    /**
     * 快手控件是否需要升级
     */
    this.needUpdate = function () {
        var ver = self.CaiNiaoVersion;
        if (ver != null) {
            var nums = ver.split(".");
            var lasts = self.lastVersion.split(".");
            return self.needUp(nums, lasts, 0);
        }
        return true;
    }

    this.needUp = function (nums, lasts, i) {
        if (Number(nums[i]) > Number(lasts[i])) {
            return false;
        } else if (Number(nums[i]) < Number(lasts[i])) {
            return true;
        } else {
            if (i < nums.length - 1) {
                return self.needUp(nums, lasts, ++i);
            } else {
                return false;
            }
        }
    }

    this.doPrint = function (datas, reSend) {
        if (!self.hasConnected()) {
            self.alertBox();
            return;
        }
        // if(!reSend){
        //   self.printingObjJD = new Object();
        //   PrintCenter.printingMap = new Object();
        //   PrintCenter.taskObject = new Object();
        // }
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            //fixme 临时处理一下 taskid的问题 因为快手taskid是全局的 随便一个报错taskid就废了
            data.task.taskID = data.task.taskID + (new Date().getTime())
            var documents = data.task.documents;
            data.task.taskStatus = "sending";
            // if(!self.isPreview && (PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3)){
            //     PrintCenter.taskObject[data.task.taskID] = data.task;
            // }

            var arr = new Array();
            var billIDs = "";
            var billNos = "";
            for (var j = 0; j < documents.length; j++) {
                var obj = new Object();
                obj.billNo = documents[j].billNo;
                obj.billID = documents[j].documentID;
                arr.push(obj);
                self.printingObjDy[documents[j].documentID] = obj;

                if (billIDs != "") billIDs += ",";
                billIDs += documents[j].documentID;
                if (billNos != "") billNos += ",";
                billNos += documents[j].billNo;
            }

            if (!self.isPreview) {
                self.printingMapDy[data.task.taskID] = arr;
            }
            // let customArea = data.task.documents[0].contents[1]
            // customArea.customData = customArea.data
            // console.log('kuaishou customArea',customArea)
            // console.log('kuaishou doPrint', data)
            //快手 打印机不能传空 如果没有传打印机 则传默认打印机
            if(!data.task.printer){
                data.task.printer = self.defaultPrinter
            }
            self.socket.send(JSON.stringify(data));
            if (PrintCenter.updateStatusMode == 2 && !self.isPreview && PrintCenter.callback) {
                PrintCenter.callback(billIDs, billNos, "", 1, i == datas.length - 1);
            }
        }
        // if((PrintCenter.updateStatusMode == 1 || PrintCenter.updateStatusMode == 3) && !self.isPreview && !reSend) {
        //     PrintCenter.showProcess(PrintCenter.printingMap);
        // }
    }

    this.alertBox = function (title, message) {
        var i = 0;
        if (!message) {
            message = "您是否已经安装打印组件？</br>";
            var href = "javascript:window.open('" + self.downloadUrl + "')";
            var target = "";
            if (myBrowser() == "FF") {
                href = self.downloadUrl;
                target = "target=\"_blank\"";
            }
            message += "<ul style='list-style-type:disc;margin-left:20px;line-height:25px;margin-top:5px;'><li style='list-style-type:disc;'>若还未安装，请<a " + target + " href=\"" + href + "\">点此下载安装</a>。安装完成后需要刷新页面才能使用。</li>";
            message += "<li style='list-style-type:disc;'>已经安装的，请先确认组件已经打开并正常运行：</li></ul>";
            message += "<div style='margin-left:25px;'>" + ++i + ".重启组件后再次尝试</br>"
            if (myBrowser() == "FF" || myBrowser().startsWith("IE")) {
                var isIE = false;
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    isIE = true;
                }
                if (isIE) {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/ie.gif' style='width:20px;height:20px;'/>&nbsp;IE11<a href='" + self.ie11Wike + "' target='_blank'>(点此查看教程)</a> </br>";
                } else {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/firefox.gif' style='width:20px;height:20px;'/>&nbsp;Firefox<a href='" + self.firefoxWiki + "' target='_blank'>(点此查看教程)</a> </br>";
                }
            }
            message += "<div style='padding-top:5px;'>" + ++i + ".若以上方法均无效，请点击右上角联系客服" + "</div>";
            message += "</div>";
        }

        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        $("body").remove("#printAlertCN").append("<div id='printAlertCN' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
            "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
            "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
            "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:120px;" +
            "width:500px;height:240px;z-index:999999;background-color:#fff;'>" +
            "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
            "&nbsp;&nbsp;提示</div>" +
            "<a style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:block;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='CainiaoPrint.hideAlertBox()'></a>" +
            "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
            "<div style='width: 90%; line-height: 20px; padding-left: 20px; font-size: 13px; margin-top: 5px;'>" +
            "<div style='font-size:14px;font-weight:bold;'>" + (title ? title : "抱歉，快手打印控件连接失败了<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/49.gif'/>") + "</div>" +
            "<div style='padding-top:8px'>" + message +
            "</div></div>" +
            //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
            "</div></div>");
        if (self.view && self.view.get("#tip_loading_prt")) self.view.get("#tip_loading_prt").hide();
    }

    this.hideAlertBox = function () {
        $("#printAlertCN").remove();
    }

    this.printTimeOut = function () {
        if (self.view && self.view.get("#tip_loading_prt").get("visible") == true) {
            var obj = PrintCenter.printingMap;
            var uids = "";
            var salercptUids = "";
            var printSalercptUid = "";
            var taskArr = new Array();
            for (var taskID in obj) {
                taskArr.push(taskID + "");
            }
            self.doGetTaskStatus(taskArr);
            for (var taskID in obj) {
                var arr = obj[taskID];
                for (var j = 0; j < arr.length; j++) {
                    var o = arr[j];
                    var expressUid = o.expressUid;
                    var salercptUid = o.salercptUid;
                    if (printSalercptUid != "") printSalercptUid += ",";
                    printSalercptUid += salercptUid;
                    uids += expressUid;
                    if (j % 5 == 0) {
                        uids += ",\n";
                    } else {
                        uids += ",";
                    }
                }
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
            if (uids != null && uids != "")
                self.alertBox(" ", "打印超时，以下快递单没有打上打印标识，请检查打印标识和实际打印出纸是否一一对应：\n" + uids);
            if (self.renderTimeOutCallBack && data.taskID.indexOf("express_") > -1) {
                self.renderTimeOutCallBack(printSalercptUid);
            }

        }
        // clearTimeout(self.isCloseId);
    }

    this.isClosed = function (preview) {
        if (!self.socket || self.socket.readyState != 1) {
            var obj = PrintCenter.printingMap;
            var uids = "";
            for (var key in obj) {
                var arr = obj[key];
                for (var j = 0; j < arr.length; j++) {
                    var o = arr[j];
                    if (!o[key]) continue;
                    var expressUid = o[key].expressUid;
                    uids += expressUid;
                    if (i % 5 == 0) {
                        uids += ",\n";
                    } else {
                        uids += ",";
                    }
                }
            }
            if (self.view) self.view.get("#tip_loading_prt").hide();
            var msg = "打印控件链接失败";
            if (uids != null && uids != "") {
                msg += "以下快递单没有打上打印标识，请检查打印标识和实际打印出纸是否一一对应：\n" + uids;
            }
            self.alertBox(" ", msg);
            // clearTimeout(self.timeOutId);
        } else {
            self.isCloseId = setTimeout(function () {
                self.isClosed(preview);
            }, 5000);
        }
    }

}


/**
 * 唯品会打印控件调用
 */
var VipCloudPrint = new function () {
    var self = this;
    this.list_address = "127.0.0.1:12233/getPrinterList";
    this.printer_address = "127.0.0.1:12233/print";
    this.randomP;
    this.defaultPrinter;
    this.printerList = new Array();//打印机列表
    this.renderCallBack;
    this.view;
    this.requestID;
    this.downloadUrl = "https://pan.corp.vipshop.com/os/share.html?pc=cwdxvk";
    this.printMapVip = new Object();
    this.printingObjVip = new Object();

    /**
     * 初始化打印控件
     */
    this.init = function (view) {
        if (myBrowser() == "IE" || myBrowser() == "IE7" || myBrowser() == "IE8" || myBrowser() == "IE9" || myBrowser() == "IE10") {
            return;
        }
        self.view = view;
        self.doConnect();
    }

    /**
     * 连接打印机
     */
    this.doConnect = function () {
        if (self.socket && self.socket.readyState == 1) {
            return;
        }
        self.socket = new WebSocket('ws://' + self.printer_address);

        // 打开Socket
        self.socket.onopen = function (event) {
            console.log("Websocket准备就绪,连接到唯品会打印控件成功")
            //alert("Websocket准备就绪,连接到客户端成功");
            self.hasOpen = true;
            //self.doGetPrinters();
            self.randomP = parseInt(10000000 * Math.random());
        };

        // 监听消息
        self.socket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            if( !data.message && data.msg ){
                data.message = data.msg
            }
            if (data.code == 200 && self.renderCallBack) {
                console.log(data);
                if (PrintCenter.updateStatusMode != 2) {
                    self.convertReslut(data);
                }
            } else if (data.code == 201 && self.renderCallBack) {
                self.convertReslut(data);
                self.randomP = parseInt(10000000 * Math.random());
                // if(self.view) self.view.get("#tip_loading_prt").hide();
                console.log(data);
                self.alertBox(" ", "打印失败：" + data.message);
                // clearTimeout(self.timeOutId);
                // clearTimeout(self.isCloseId);
            } else {
                if (self.view)
                    self.view.get("#tip_loading_prt").hide();
                console.log(data);
                self.alertBox(" ", "打印失败：" + data.message);
                // clearTimeout(self.timeOutId);
                // clearTimeout(self.isCloseId);
            }
        }

        // 监听Socket的关闭
        self.socket.onclose = function (event) {
            self.hasOpen = false;
            console.log("唯品会打印控件socket链接已经被关闭!");
            //self.alertBox("云集打印控件已经被关闭！");
        }

        self.socket.onerror = function (event) {
            self.hasOpen = false;
            if (self.operMode == operModeList.preview
                || self.operMode == operModeList.print) {
                var data = JSON.parse(event.data);
                alert("唯品会打印控件发生错误:" + JSON.stringify(data))
            }
        }
    }

    this.convertReslut = function (data) {
        var json = new Object();
        json.taskID = data.traceId;
        json.cmd = "print";
        json.status = data.code == 200 ? "success" : "failed";
        self.renderCallBack(json, self.printMapVip);
        PrintCenter.refreshSeriesPrintingTasks(json);
    }

    this.hasConnected = function () {
        if (self.socket && self.socket.readyState == 1) {
            return true;
        } else {
            self.doConnect();
        }
        return false;
    }

    /***
     * 获取打印机列表
     */
    this.doGetPrinters = function () {
        self.socket2 = new WebSocket('ws://' + self.list_address);
        var random = parseInt(100000000 * Math.random());
        var request = {
            requestID: random,
            version: self.version,
            cmd: "getPrinters"
        };
        self.socket2.send(JSON.stringify(request));
        self.socket2.onmessage = function (event) {
            var data = JSON.parse(event.data);
            var printers = data.printers;//data.content.split(",");
            if (printers.length > 0) {
                var hasEmpty = false;
                for (var i = 0; i < self.printerList.length; i++) {
                    var obj = self.printerList[i];
                    if (obj.key == "")
                        hasEmpty = true;
                }
                if (!hasEmpty) {
                    self.printerList.push({
                        key: "",
                        value: ""
                    });
                }
                for (var i = printers.length; i > 0;) {
                    var printerName = printers[--i];
                    // if (printers[--i].isDefault) {
                    //   self.defaultPrinter = printerName;
                    // }
                    var hasPrinter = false;
                    for (var j = 0; j < self.printerList.length; j++) {
                        var obj = self.printerList[j];
                        if (obj.key == printerName)
                            hasPrinter = true;
                    }
                    if (!hasPrinter) {
                        self.printerList.push({
                            key: printerName,
                            value: printerName
                        });
                    }
                }
            } else {
                self.alertBox(" ", "系统没有可用的打印机，请检查操作系统的设备与打印机");
            }
        }
    }

    /**
     * 返回打印机列表
     * @returns  array[{key:printerName, value:printerName}]
     */
    this.getPrinterList = function () {
        return self.printerList;
    }

    this.doPrint = function (datas, reSend) {
        if (!self.hasConnected()) {
            self.alertBox();
            if (self.view) self.view.get("#tip_loading_prt").hide();
            return;
        }

        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            var documents = data.task.documents;

            var arr = new Array();
            var billIDs = "";
            var billNos = "";
            for (var j = 0; j < documents.length; j++) {
                var obj = new Object();
                obj.billNo = documents[j].billNo;
                obj.billID = documents[j].documentID;
                arr.push(obj);
                self.printingObjVip[documents[j].documentID] = obj;

                if (billIDs != "") billIDs += ",";
                billIDs += documents[j].documentID;
                if (billNos != "") billNos += ",";
                billNos += documents[j].billNo;
            }

            if (!self.isPreview) {
                self.printMapVip[data.traceId] = arr;
            }
            self.socket.send(JSON.stringify(data));
            if (PrintCenter.updateStatusMode == 2 && !self.isPreview && PrintCenter.callback) {
                PrintCenter.callback(billIDs, billNos, "", 1, i == datas.length - 1);
            }
        }

    }

    this.hideAlertBox = function () {
        $("#printAlertJD").remove();
    }

    this.alertBox = function (title, message) {
        var i = 0;
        if (!message) {
            message = "您是否已经安装打印组件？</br>";
            var href = "javascript:window.open('" + self.downloadUrl + "')";
            var target = "";
            if (myBrowser() == "FF") {
                href = self.downloadUrl;
                target = "target=\"_blank\"";
            }
            message += "<ul style='list-style-type:disc;margin-left:20px;line-height:25px;margin-top:5px;'><li style='list-style-type:disc;'>若还未安装，请<a " + target + " href=\"" + href + "\">点此下载安装</a>。下载密码：BP98xn ，安装完成后需要刷新页面才能使用。</li>";
            message += "<li style='list-style-type:disc;'>已经安装的，请先确认组件已经打开并正常运行：</li></ul>";
            message += "<div style='margin-left:25px;'>" + ++i + ".重启组件后再次尝试</br>"
            if (myBrowser() == "FF" || myBrowser().startsWith("IE")) {
                var isIE = false;
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    isIE = true;
                }
                if (isIE) {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/ie.gif' style='width:20px;height:20px;'/>&nbsp;IE11<a href='" + self.ie11Wike + "' target='_blank'>(点此查看教程)</a> </br>";
                } else {
                    message += ++i + ".检查浏览器设置，是否允许组件加载。<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/firefox.gif' style='width:20px;height:20px;'/>&nbsp;Firefox<a href='" + self.firefoxWiki + "' target='_blank'>(点此查看教程)</a> </br>";
                }
            }
            message += "<div style='padding-top:5px;'>" + ++i + ".若以上方法均无效，请点击右上角联系客服" + "</div>";
            message += "</div>";
        }

        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        $("body").remove("#printAlertJD").append("<div id='printAlertJD' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
            "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
            "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
            "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:120px;" +
            "width:500px;height:240px;z-index:999999;background-color:#fff;'>" +
            "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
            "&nbsp;&nbsp;提示</div>" +
            "<a style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:block;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='VipCloudPrint.hideAlertBox()'></a>" +
            "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
            "<div style='width: 90%; line-height: 20px; padding-left: 20px; font-size: 13px; margin-top: 5px;'>" +
            "<div style='font-size:14px;font-weight:bold;'>" + (title ? title : "抱歉，唯品会打印组件连接失败了<img src='https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/print/49.gif'/>") + "</div>" +
            "<div style='padding-top:8px'>" + message +
            "</div></div>" +
            //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
            "</div></div>");
    }

    this.showPreview = function (content) {
        var cWidth = document.body.clientWidth;
        var cHeight = document.body.clientHeight;
        $("body").remove("#printPreviewVip").append("<div id='printPreviewVip' style='position:absolute;top:0px;left:0px;width:" + cWidth + "px;height:" + cHeight + "px;" +
            "z-index:999990;background-color: rgba(0,0,0,0.5);'>" +
            "<div style='border:1px solid #bbbbbb;border-radius: 6px;box-shadow: 0px 3px 10px #555;-moz-box-shadow:0px 3px 10px #555;" +
            "-webkit-box-shadow:0px 3px 10px #555;position:absolute;left:" + (cWidth - 500) / 2 + "px;top:10px;" +
            "width:500px;height:600px;z-index:999999;background-color:#fff;'>" +
            "<div style='font-size:14px;font-weight:bold;text-align:left;padding:5px 5px;background-color:#E6E6E6;border-radius:6px;'>" +
            "&nbsp;&nbsp;预览</div>" +
            "<a style='width:18px;height:18px;position:absolute;top:4px;right:4px;display:block;background: url(https://herp.oss-cn-hangzhou.aliyuncs.com/static/images/icon-gray.png) -96px -128px no-repeat;' onclick='VipCloudPrint.hidePreview()'></a>" +
            "<div style='background-color:#E6E6E6;height:15px;margin-top:-15px;'></div>" +
            "<div style='padding-top:8px;overflow:auto;height:560px;width:500px;'><img style='max-width:495px;' src='data:image/png;base64," + content + "'/>" +
            "</div>" +
            //"<div style='width:100px;margin:15px auto;'><button style='cursor:pointer;height: 26px;background: #ff8b00;font-size: 12px;color: #fff;font-family: \"Microsoft Yahei\";line-height: 26px;border: none;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;width:90px;text-align:center;' onclick='CainiaoPrint.hideAlertBox()'><span>我知道啦！</span></button></div>" +
            "</div></div>");
    }


    this.hidePreview = function () {
        $("#printPreviewVip").remove();
    }

}

function myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1
        && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1
        && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1
        && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return "IE7";
        } else if (fIEVersion == 8) {
            return "IE8";
        } else if (fIEVersion == 9) {
            return "IE9";
        } else if (fIEVersion == 10) {
            return "IE10";
        } else if (fIEVersion == 11) {
            return "IE11";
        } else {
            return "0";
        }//IE版本过低
        return "IE";
    }
    if (isOpera) {
        return "Opera";
    }
    if (isEdge) {
        return "Edge";
    }
    if (isFF) {
        return "FF";
    }
    if (isSafari) {
        return "Safari";
    }
    if (isChrome) {
        return "Chrome";
    }
}

$(document).ready(function () {
    PrintCenter.init(null);
});
