import {AdminSectionContext} from '@/src/types/admin'

export async function backToAdminSection(ctx: AdminSectionContext): Promise<void> {
  await ctx.scene.enter('admin_section', {sectionID: ctx.section.id})
}
