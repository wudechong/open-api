const directives = {
	focus: {
		inserted(el) {
			el.querySelector("input").focus();
		},
	},
	select: {
		inserted(el) {
			el.querySelector("input").select();
		},
	},
	focusSelect: {
		inserted: function(el) {
			const input = el.querySelector("input");
			input.focus();
			input.select()
			input.addEventListener("focus", () => {
				input.select();
			});
		},
	},
	selectAll: {
		inserted: function(el) {
			const input = el.querySelector("input");
			input.addEventListener("focus", () => {
				input.select();
			});
		},
	},
	// 单行省略
	omit: {
		inserted: function(el) {
			el.classList.add("omit");
		},
	},
	numberInt: {
		bind: function(el, binding, vnode) {
			const element = el.getElementsByTagName("input")[0];
			const len = binding.arg; // 初始化设置
			element.addEventListener("input", function() {
				element.value = element.value.toString().replace(/[^\d.]/g, "");
				if (Number(len) === 0) {
					element.value = Number(element.value).toFixed(0);
				}
				if (isNaN(element.value)) {
					vnode.data.model.callback(null);
				} else {
					vnode.data.model.callback(element.value);
				}
			});
		},
	},
	//弹窗拖动
	dialogDrag: {
		bind: function(el, binding, vnode, oldVnode) {
			const dialogHeaderEl = el.querySelector(".el-dialog__header");
			const dragDom = el.querySelector(".el-dialog");
			//dialogHeaderEl.style.cursor = 'move';
			dialogHeaderEl.style.cssText += ";cursor:move;";
			dragDom.style.cssText += ";top:0px;";

			// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
			const sty = (function() {
				if (window.document.currentStyle) {
					return (dom, attr) => dom.currentStyle[attr];
				} else {
					return (dom, attr) => getComputedStyle(dom, false)[attr];
				}
			})();

			dialogHeaderEl.onmousedown = (e) => {
				// 鼠标按下，计算当前元素距离可视区的距离
				const disX = e.clientX - dialogHeaderEl.offsetLeft;
				const disY = e.clientY - dialogHeaderEl.offsetTop;

				const screenWidth = document.body.clientWidth; // body当前宽度
				const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

				const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
				const dragDomheight = dragDom.offsetHeight; // 对话框高度

				const minDragDomLeft = dragDom.offsetLeft;
				const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

				const minDragDomTop = dragDom.offsetTop;
				const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;

				// 获取到的值带px 正则匹配替换
				let styL = sty(dragDom, "left");
				let styT = sty(dragDom, "top");

				// 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
				if (styL.includes("%")) {
					styL = +document.body.clientWidth * (+styL.replace(/\%/g, "") / 100);
					styT = +document.body.clientHeight * (+styT.replace(/\%/g, "") / 100);
				} else {
					styL = +styL.replace(/\px/g, "");
					styT = +styT.replace(/\px/g, "");
				}

				document.onmousemove = function(e) {
					// 通过事件委托，计算移动的距离
					let left = e.clientX - disX;
					let top = e.clientY - disY;

					// 边界处理
					if (-left > minDragDomLeft) {
						left = -minDragDomLeft;
					} else if (left > maxDragDomLeft) {
						left = maxDragDomLeft;
					}

					if (-top > minDragDomTop) {
						top = -minDragDomTop;
					} else if (top > maxDragDomTop) {
						top = maxDragDomTop;
					}

					// 移动当前元素
					dragDom.style.cssText += `;left:${left + styL}px;top:${top +
						styT}px;`;
				};

				document.onmouseup = function(e) {
					document.onmousemove = null;
					document.onmouseup = null;
				};
			};
		},
	},
	//弹窗推动放大
	dialogDragBig: {
		bind: function(el, binding, vnode, oldVnode) {
			//弹框可拉伸最小宽高
			let minWidth = 400;
			let minHeight = 300;
			//初始非全屏
			let isFullScreen = false;
			//当前宽高
			let nowWidth = 0;
			let nowHight = 0;
			//当前顶部高度
			let nowMarginTop = 0;
			//获取弹框头部（这部分可双击全屏）
			const dialogHeaderEl = el.querySelector('.el-dialog__header');
			//弹窗
			const dragDom = el.querySelector('.el-dialog');
			//给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
			// dragDom.style.overflowX = "auto";
			//清除选择头部文字效果
			dialogHeaderEl.onselectstart = new Function("return false");
			//头部加上可拖动cursor
			dialogHeaderEl.style.cursor = 'move';
	
			// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
			const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
	
			let moveDown = (e) => {
				// 鼠标按下，计算当前元素距离可视区的距离
				const disX = e.clientX - dialogHeaderEl.offsetLeft;
				const disY = e.clientY - dialogHeaderEl.offsetTop;
	
				// 获取到的值带px 正则匹配替换
				let styL, styT;
	
				// 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
				if (sty.left.includes('%')) {
					styL = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100);
					styT = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100);
				} else {
					styL = +sty.left.replace(/px/g, '');
					styT = +sty.top.replace(/px/g, '');
				}
				;
	
				document.onmousemove = function (e) {
					// 通过事件委托，计算移动的距离
					const l = e.clientX - disX;
					const t = e.clientY - disY;
	
					// 移动当前元素
					dragDom.style.left = `${l + styL}px`;
					dragDom.style.top = `${t + styT}px`;
	
					//将此时的位置传出去
					//binding.value({x:e.pageX,y:e.pageY})
				};
	
				document.onmouseup = function (e) {
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
			dialogHeaderEl.onmousedown = moveDown;
			//双击头部效果
			dialogHeaderEl.ondblclick = (e) => {
				if (isFullScreen == false) {
					nowHight = dragDom.clientHeight;
					nowWidth = dragDom.clientWidth;
					nowMarginTop = dragDom.style.marginTop;
					dragDom.style.left = 0;
					dragDom.style.top = 0;
					dragDom.style.height = "100VH";
					dragDom.style.width = "100VW";
					dragDom.style.marginTop = 0;
					isFullScreen = true;
					dialogHeaderEl.style.cursor = 'initial';
					dialogHeaderEl.onmousedown = null;
				} else {
					dragDom.style.height = "auto";
					dragDom.style.width = nowWidth + 'px';
					dragDom.style.marginTop = nowMarginTop;
					isFullScreen = false;
					dialogHeaderEl.style.cursor = 'move';
					dialogHeaderEl.onmousedown = moveDown;
				}
			}
	
			//拉伸(右下方)
			let resizeEl = document.createElement("div");
			dragDom.appendChild(resizeEl);
			//在弹窗右下角加上一个10-10px的控制块
			resizeEl.style.cursor = 'se-resize';
			resizeEl.style.position = 'absolute';
			resizeEl.style.height = '10px';
			resizeEl.style.width = '10px';
			resizeEl.style.right = '0px';
			resizeEl.style.bottom = '0px';
			resizeEl.style.zIndex = '99';
			//鼠标拉伸弹窗
			resizeEl.onmousedown = (e) => {
				// 记录初始x位置
				let clientX = e.clientX;
				// 鼠标按下，计算当前元素距离可视区的距离
				let disX = e.clientX - resizeEl.offsetLeft;
				let disY = e.clientY - resizeEl.offsetTop;
	
				document.onmousemove = function (e) {
					e.preventDefault(); // 移动时禁用默认事件
	
					// 通过事件委托，计算移动的距离
					let x = e.clientX - disX + (e.clientX - clientX);//这里 由于elementUI的dialog控制居中的，所以水平拉伸效果是双倍
					let y = e.clientY - disY;
					//比较是否小于最小宽高
					dragDom.style.width = x > minWidth ? `${x}px` : minWidth + 'px';
					dragDom.style.height = y > minHeight ? `${y}px` : minHeight + 'px';
				};
				//拉伸结束
				document.onmouseup = function (e) {
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
	
			//拉伸(右边)
			let resizeElR = document.createElement("div");
			dragDom.appendChild(resizeElR);
			//在弹窗右下角加上一个10-10px的控制块
			resizeElR.style.cursor = 'w-resize';
			resizeElR.style.position = 'absolute';
			resizeElR.style.height = '100%';
			resizeElR.style.width = '3px';
			resizeElR.style.right = '0px';
			resizeElR.style.top = '0px';
			//鼠标拉伸弹窗
			resizeElR.onmousedown = (e) => {
				let elW = dragDom.clientWidth;
				let EloffsetLeft = dragDom.offsetLeft;
				// 记录初始x位置
				let clientX = e.clientX;
				document.onmousemove = function (e) {
					e.preventDefault(); // 移动时禁用默认事件
					//右侧鼠标拖拽位置
					if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
						//往左拖拽
						if (clientX > e.clientX) {
							if (dragDom.clientWidth < minWidth) {
							} else {
								dragDom.style.width = elW - (clientX - e.clientX) + 'px';
							}
						}
						//往右拖拽
						if (clientX < e.clientX) {
							dragDom.style.width = elW + (e.clientX - clientX) + 'px';
						}
					}
	
				};
				//拉伸结束
				document.onmouseup = function (e) {
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
	
			//拉伸(左边)
			let resizeElL = document.createElement("div");
			dragDom.appendChild(resizeElL);
			//在弹窗右下角加上一个10-10px的控制块
			resizeElL.style.cursor = 'w-resize';
			resizeElL.style.position = 'absolute';
			resizeElL.style.height = '100%';
			resizeElL.style.width = '3px';
			resizeElL.style.left = '0px';
			resizeElL.style.top = '0px';
			//鼠标拉伸弹窗
			resizeElL.onmousedown = (e) => {
				let elW = dragDom.clientWidth;
				let EloffsetLeft = dragDom.offsetLeft;
				// 记录初始x位置
				let clientX = e.clientX;
				document.onmousemove = function (e) {
					e.preventDefault(); // 移动时禁用默认事件
					//左侧鼠标拖拽位置
					if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
						//往左拖拽
						if (clientX > e.clientX) {
							dragDom.style.width = elW + (clientX - e.clientX) + 'px';
						}
						//往右拖拽
						if (clientX < e.clientX) {
							if (dragDom.clientWidth < minWidth) {
							} else {
								dragDom.style.width = elW - (e.clientX - clientX) + 'px';
	
							}
						}
					}
	
				};
				//拉伸结束
				document.onmouseup = function (e) {
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
	
			// 拉伸(下边)
			let resizeElB = document.createElement("div");
			dragDom.appendChild(resizeElB);
			//在弹窗右下角加上一个10-10px的控制块
			resizeElB.style.cursor = 'n-resize';
			resizeElB.style.position = 'absolute';
			resizeElB.style.height = '3px';
			resizeElB.style.width = '100%';
			resizeElB.style.left = '0px';
			resizeElB.style.bottom = '0px';
			//鼠标拉伸弹窗
			resizeElB.onmousedown = (e) => {
				let EloffsetTop = dragDom.offsetTop;
				let ELscrollTop = el.scrollTop;
				let clientY = e.clientY;
				let elH = dragDom.clientHeight;
				document.onmousemove = function (e) {
					e.preventDefault(); // 移动时禁用默认事件
					//底部鼠标拖拽位置
					if (ELscrollTop + clientY > EloffsetTop + elH - 20 && ELscrollTop + clientY < EloffsetTop + elH) {
						//往上拖拽
						if (clientY > e.clientY) {
							if (dragDom.clientHeight < minHeight) {
							} else {
								dragDom.style.height = elH - (clientY - e.clientY) + 'px';
							}
						}
						//往下拖拽
						if (clientY < e.clientY) {
							if (dragDom.offsetHeight + dragDom.offsetTop > document.body.clientHeight) {
							}else{
								dragDom.style.height = elH + (e.clientY - clientY) + 'px';
							}
						}
					}
				};
				//拉伸结束
				document.onmouseup = function (e) {
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
		}
	},
	// 省略
	showTips: {
	// el {element} 当前元素
		bind (el, binding) {
			let placement = binding.value&&binding.value.placement? binding.value.placement : 'bottom';
			const curStyle = window.getComputedStyle(el, ''); // 获取当前元素的style
			const textSpan = document.createElement('span'); // 创建一个容器来记录文字的width
			// 设置新容器的字体样式，确保与当前需要隐藏的样式相同
			textSpan.style.fontSize = curStyle.fontSize;
			textSpan.style.fontWeight = curStyle.fontWeight;
			textSpan.style.fontFamily = curStyle.fontFamily;
			// 将容器插入body，如果不插入，offsetWidth为0
			document.body.appendChild(textSpan);
			// 设置新容器的文字
			textSpan.innerHTML = binding.value && binding.value.content ?binding.value.content : el.innerText;
			let trueWidth = textSpan.offsetWidth>400 ? 400 : textSpan.offsetWidth;
			// 如果字体元素大于当前元素，则需要隐藏
			// 给当前元素设置超出隐藏
			el.style.overflow = 'hidden';
			el.style.textOverflow = 'ellipsis';
			el.style.whiteSpace = 'nowrap';
				// 鼠标移入
			el.onmouseenter = function (e) {
				let target = e.target;
				if (trueWidth > target.offsetWidth) {
					let offsetTop = target.offsetTop,
						offsetLeft = target.offsetLeft,
						p = target.offsetParent,
						pHeight = 0;
					while(p!=null)
					{
						offsetTop += p.offsetTop; 
						offsetLeft += p.offsetLeft;
						pHeight = p.offsetHeight;
						p = p.offsetParent;
					}
					// 创建浮层元素并设置样式 
					let hpTooltipDom = document.createElement('div');
					let cssText = `
						max-width:400px;
						max-height: 400px;
						overflow: auto;
						position: fixed;
						background: rgb(86, 86, 86);
						color:#fff;
						border-radius:5px;
						padding:8px;
						display:inline-block;
						font-size:12px;
						z-index:19999;
					`;
					if (offsetLeft + (trueWidth + target.offsetWidth)/2>document.body.scrollWidth) {
						cssText += `right:0;`;
					} else if (offsetLeft - (trueWidth-target.offsetWidth)/2 - 10>=0) {
						cssText += `left:${offsetLeft - (trueWidth-target.offsetWidth)/2 - 10}px;`;
					} else {
						cssText += `left:0;`;
					}
					if (placement === "top" &&  offsetTop - target.offsetHeight > 5) {
						cssText += `bottom: ${pHeight - offsetTop + 8}px;`
					} else {
						cssText += `top:${target.offsetHeight + offsetTop + 8}px;`
					}
					hpTooltipDom.style.cssText = cssText;
					// 设置id方便寻找
					hpTooltipDom.setAttribute('id', 'hp-tooltip');
					let hpTooltipIcon= document.createElement('div');
					let iconCss = `
						position: fixed;
						width: 0;
						height: 0;
						border-left: 5px solid transparent;
						border-right: 5px solid transparent;
						left: ${offsetLeft + target.offsetWidth / 2 - 10}px;
						z-index: 19999;
					`;
					if (placement === "top" &&  offsetTop - target.offsetHeight > 5) {
						iconCss += `border-bottom: none;border-top: 5px solid rgb(85, 85, 85);bottom: ${pHeight - offsetTop + 3}px;`
					} else {
						iconCss += `border-top: none;border-bottom: 5px solid rgb(85, 85, 85);top: ${target.offsetHeight + offsetTop + 3}px;`
					}
					hpTooltipIcon.style.cssText = iconCss;
					hpTooltipIcon.setAttribute('id', 'hp-tipicon');
					// 将浮层插入到body中
					document.body.appendChild(hpTooltipDom);
					document.body.appendChild(hpTooltipIcon);
					// 浮层中的文字
					document.getElementById('hp-tooltip').innerHTML = binding.value && binding.value.content ?binding.value.content : el.innerText;
				}
			}
			// 鼠标移出
			el.onmouseleave = function () {
				// 找到浮层元素并移出
				const hpTooltipDom = document.getElementById('hp-tooltip')
				hpTooltipDom && document.body.removeChild(hpTooltipDom)
				const hpTooltipIcon = document.getElementById('hp-tipicon')
				hpTooltipIcon && document.body.removeChild(hpTooltipIcon)
			}
			// 记得移除刚刚创建的记录文字的容器
			document.body.removeChild(textSpan)
		},
		// 指令与元素解绑时
		unbind () {
			// 找到浮层元素并移除
			const hpTooltipDom = document.getElementById('hp-tooltip')
			hpTooltipDom && document.body.removeChild(hpTooltipDom)
			const hpTooltipIcon = document.getElementById('hp-tipicon')
			hpTooltipIcon && document.body.removeChild(hpTooltipIcon)
		}
	}
};

const install = function(Vue) {
	for (let key in directives) {
		Vue.directive(key, directives[key]);
	}
};

export default install;
