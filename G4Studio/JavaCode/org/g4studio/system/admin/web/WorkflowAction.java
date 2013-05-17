package org.g4studio.system.admin.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.g4studio.core.mvc.xstruts.action.ActionForm;
import org.g4studio.core.mvc.xstruts.action.ActionForward;
import org.g4studio.core.mvc.xstruts.action.ActionMapping;
import org.g4studio.core.web.BizAction;
import org.g4studio.system.admin.service.ResourceService;
import org.jbpm.api.Configuration;
import org.jbpm.api.ProcessDefinition;
import org.jbpm.api.ProcessEngine;
import org.jbpm.api.RepositoryService;

/**
 * 流程维护界面.  * WorkflowAction   * lishuiqing  * May 17, 2013 9:32:59 PM   *
 * 
 * @version 1.0.0  
 */
public class WorkflowAction extends BizAction {

	private ResourceService resourceService = (ResourceService) super
			.getService("resourceService");

	public ActionForward initWorkflow(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		return mapping.findForward("workflowlist");
	}

	public ActionForward initWorkflowList(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		// 获得引擎
		ProcessEngine engine = Configuration.getProcessEngine();
		// 可以获得全部所有流程定义和获得流程定义，显示流程定义等
		RepositoryService service = engine.getRepositoryService();
		List<ProcessDefinition> list = service.createProcessDefinitionQuery()
				.list();
		int size = list == null ? 0 : list.size();
		StringBuilder builder = new StringBuilder("{TOTALCOUNT:" + size
				+ ",ROOT:[");
		for (ProcessDefinition def : list) {
			builder.append("{\"name\":\"" + def.getName() + "\",");
			builder.append("\"version\":\"" + def.getVersion() + "\",");
			builder.append("\"deploymentId\":\"" + def.getDeploymentId()
					+ "\",");
			builder.append("\"id\":\"" + def.getId() + "\",");
			builder.append("\"description\":\"" + def.getDescription() + "\",");
			builder.append("\"key\":\"" + def.getKey() + "\"},");
		}
		builder.deleteCharAt(builder.lastIndexOf(","));
		builder.append("]}");
		// Integer totalCount = list.size();
		// String jsonStrList = JsonHelper.encodeList2PageJson(list, totalCount,
		// null);

		write(builder.toString(), response);
		return mapping.findForward(null);
	}
}
