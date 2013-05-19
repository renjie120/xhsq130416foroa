package org.g4studio.system.admin.service.impl;

import org.g4studio.core.metatype.Dto;
import org.g4studio.core.model.service.impl.BizServiceImpl;
import org.g4studio.system.admin.service.WorkflowService;

/**
 * 工作流操作类.  * WorkflowServiceImpl   * lishuiqing  * May 19, 2013 4:45:25 PM   *
 * 
 * @version 1.0.0  
 */
public class WorkflowServiceImpl extends BizServiceImpl implements
		WorkflowService {
	@Override
	public Dto updateWorkflow(Dto dto) {
		g4Dao.update("Workflow.updateWorkflow", dto);
		return null;
	}

	@Override
	public Dto deleteWorkflow(Dto dto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Dto deployWorkflow(Dto dto) {
		// TODO Auto-generated method stub
		return null;
	}

}
