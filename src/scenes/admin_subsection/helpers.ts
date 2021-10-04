import {AdminSectionContext} from '@/src/types/admin'

export async function backToAdminSubsections(ctx: AdminSectionContext): Promise<void> {
  await ctx.scene.enter('admin_subsections', {sectionID: ctx.section.parentSectionID})
}
