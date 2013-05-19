package org.g4studio.system.admin.service;

import org.g4studio.core.metatype.Dto;
import org.g4studio.core.model.service.BizService;

/**
 * 资源模型业务接口
 * 
 * @author XiongChun
 * @since 2010-01-13
 */
public interface WorkflowService extends BizService{
	
	/**
	 * 发布工作流
	 * @param pDto
	 * @return
	 */
	public Dto deployWorkflow(Dto pDto);
	
	/**
	 * 删除工作流
	 * @param pDto
	 * @return
	 */
	public Dto deleteWorkflow(Dto pDto);
	
	/**
	 * 修改代码表
	 * @param pDto
	 * @return
	 */
	public Dto updateWorkflow(Dto pDto);
	 
	
}
